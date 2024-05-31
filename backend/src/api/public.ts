import express, { Request, Response, Express } from "express";
import { getPokemonList } from "../data";
import { testGuess } from "../features/player";
import { countRemainingPokemonFromHistory } from "../features/solver";
import {
  PokemonSummary,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { updateUserStats } from "../features/user";
import { getAuth } from "firebase-admin/auth";
import {
  getCheckoutSession,
  getCheckoutSessionListItems,
} from "../features/payments";
import { GENERATION } from "../../../types/user.types";

export const addPublicRoutes = (app: Express) => {
  app.get("/", (_: Request, res: Response) => {
    res.send("Pokedle Server");
  });

  app.post("/status/:gen", express.json(), (req: Request, res: Response) => {
    const gen = req.params.gen as GENERATION;
    const validationGuessHistory = req.body as PokemonValidationGuess[];
    const remainingPokemon = countRemainingPokemonFromHistory(
      validationGuessHistory,
      gen
    );
    const totalPokemon = getPokemonList(gen).length;

    res.send({
      remainingPokemon,
      totalPokemon,
    });
  });

  app.get("/pokemon/:gen", (req: Request, res: Response) => {
    const gen = req.params.gen as GENERATION;
    const name = req.query.name as string;
    const cleanName = name ? name.trim().toLowerCase() : "";
    const summary: PokemonSummary[] = getPokemonList(gen)
      .filter((p) => !cleanName || p.name.includes(cleanName))
      .slice(0, 10)
      .map((pokemon) => {
        return {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
        };
      });
    res.send(summary);
  });

  app.post(
    "/guess-pokemon/:pokemonId/:gen",
    express.json(),
    async (req: Request, res: Response) => {
      const pokemonId = req.params.pokemonId;
      const gen = req.params.gen as GENERATION;
      const validationGuessHistory = req.body as PokemonValidationGuess[];

      const { validationGuess, isWinningGuess } = await testGuess(
        pokemonId,
        gen
      );
      const remainingPokemon = isWinningGuess
        ? 0
        : countRemainingPokemonFromHistory(validationGuessHistory, gen);

      if (isWinningGuess) {
        const bearerToken = req.header("Authorization");
        if (bearerToken) {
          const claims = await getAuth().verifyIdToken(
            bearerToken?.split("Bearer ")[1]
          );
          const userId = claims.uid;
          if (userId) {
            await updateUserStats({
              userId,
              totalGuesses: (validationGuessHistory.length ?? 0) + 1,
            });
          }
        }
      }
      res.send({ validation: validationGuess, remainingPokemon });
    }
  );

  app.get("/checkout-session/:id", async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const checkoutSession = await getCheckoutSession(sessionId);
    const lineItems = await getCheckoutSessionListItems(sessionId);
    res.send({ checkoutSession, lineItems });
  });

  return app;
};

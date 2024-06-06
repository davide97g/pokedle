import express, { Express, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import {
  PokemonSummary,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { GENERATION } from "../../../types/user.types";
import { version } from "../../package.json";
import { getPokemonList } from "../data";
import { testGuess } from "../features/player";
import { getCurrentStatsID } from "../features/player/manager";
import { countRemainingPokemonFromHistory } from "../features/solver";
import { updateUserStats } from "../features/user";
import { getUserInfoFromToken } from "../middleware/utils";

export const addPublicRoutes = (app: Express) => {
  app.get("/", (_: Request, res: Response) => {
    res.send({ message: "Pokedle Server", version });
  });

  app.post("/status/:gen", express.json(), (req: Request, res: Response) => {
    const gen = req.params.gen as GENERATION;
    const validationGuessHistory = req.body as PokemonValidationGuess[];
    const remainingPokemon = countRemainingPokemonFromHistory(
      validationGuessHistory,
      gen
    );
    const totalPokemon = getPokemonList(gen).length;
    const sid = getCurrentStatsID(gen);

    res.send({
      remainingPokemon,
      totalPokemon,
      sid,
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
      const user = await getUserInfoFromToken(req);

      const { validationGuess, isWinningGuess } = await testGuess({
        gen,
        pokemonGuessId: pokemonId,
        user: user ?? undefined,
      });
      validationGuess.order = validationGuessHistory.length + 1;

      const remainingPokemon = isWinningGuess
        ? 0
        : countRemainingPokemonFromHistory(
            [...validationGuessHistory, validationGuess],
            gen
          );

      if (isWinningGuess && user?.uid) {
        await updateUserStats({
          userId: user.uid,
          totalGuesses: (validationGuessHistory.length ?? 0) + 1,
        });
      }

      res.send({ validation: validationGuess, remainingPokemon });
    }
  );

  return app;
};

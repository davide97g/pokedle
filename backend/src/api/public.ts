import express, { Request, Response, Express } from "express";
import { GENERATION, getPokemonList } from "../data";
import { testGuess } from "../features/player";
import { countRemainingPokemonFromHistory } from "../features/solver";
import {
  PokemonSummary,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";

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
      const validation = await testGuess(pokemonId, gen);
      const remainingPokemon = countRemainingPokemonFromHistory(
        validationGuessHistory,
        gen
      );
      res.send({ validation, remainingPokemon });
    }
  );

  return app;
};

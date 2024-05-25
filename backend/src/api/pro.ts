import express, { Express, Request, Response } from "express";
import { PokemonValidationGuess } from "../../../types/pokemon.model";
import { GENERATION } from "../data";
import { isPro } from "../middleware/isPro";
import { guessPokemon } from "../features/solver";

export const addProRoutes = (app: Express) => {
  app.post(
    "/best-guess/:gen",
    [isPro, express.json()],
    (req: Request, res: Response) => {
      const validationGuessHistory = req.body as PokemonValidationGuess[];
      const gen = req.params.gen as GENERATION;
      const pokemon = guessPokemon(validationGuessHistory, gen);
      res.send({ pokemon });
    }
  );
  return app;
};

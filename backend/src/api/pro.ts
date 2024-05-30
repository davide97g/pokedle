import express, { Express, Request, Response } from "express";
import { PokemonValidationGuess } from "../../../types/pokemon.model";
import { GENERATION } from "../data";
import { isPro } from "../middleware/isPro";
import { guessPokemon } from "../features/solver";
import { decrementUserBestGuesses } from "../features/user";
import { getAuth } from "firebase-admin/auth";

export const addProRoutes = (app: Express) => {
  app.post(
    "/best-guess/:gen",
    [isPro],
    express.json(),
    async (req: Request, res: Response) => {
      const validationGuessHistory = req.body as PokemonValidationGuess[];
      const gen = req.params.gen as GENERATION;
      const pokemon = guessPokemon(validationGuessHistory, gen);
      const bearerToken = req.header("Authorization");
      if (bearerToken) {
        const claims = await getAuth().verifyIdToken(
          bearerToken?.split("Bearer ")[1]
        );
        const userId = claims.uid;
        if (userId) await decrementUserBestGuesses({ userId });
        res.send({ pokemon });
      } else {
        res.status(401).send({ message: "Unauthorized" });
      }
    }
  );
  return app;
};

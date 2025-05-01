import { NextFunction, Request, Response, type Express } from "express";
import { computeValidationGuess } from "../services/guess.service";

export const createGuessController = (app: Express) => {
  // get guess feedback results
  app.post(
    "/guess/:pokemonId",
    async (
      req: Request<{ pokemonId: string }>,
      res: Response,
      _: NextFunction
    ) => {
      try {
        const { pokemonId } = req.params;
        if (!pokemonId) {
          res.status(400).send("Pokemon Id is required");
        }
        const pokemonIdNumber = Number(pokemonId);
        if (isNaN(pokemonIdNumber)) {
          res.status(400).send("Invalid Pokemon Id");
        }

        const validationGuess = await computeValidationGuess(pokemonIdNumber);

        if (!validationGuess) {
          res.status(400).send("Pokemon not found");
        }
        res.status(200).send({
          validationGuess,
        });
      } catch (error) {
        console.error("Error computing the validation of your guess", error);
        res.status(500).send("Internal Server Error");
      }
    }
  );
};

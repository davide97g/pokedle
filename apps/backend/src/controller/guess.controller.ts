import { NextFunction, Request, Response, type Express } from "express";
import { isLogged } from "../middlewares/authentication";
import { getBestPokemonToGuess, guessPokemon } from "../services/guess.service";
import { getUserInfoFromToken } from "../utils/tokenInfo";

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

        const guessNumber = Number(req.body.guessNumber);
        if (isNaN(guessNumber)) {
          res.status(400).send("Invalid Guess");
        }
        if (guessNumber < 1) {
          res.status(400).send("Guess must be positive");
        }

        const user = await getUserInfoFromToken(req);

        const validationGuess = await guessPokemon(
          pokemonIdNumber,
          user?.uid
            ? {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL,
              }
            : undefined,
          guessNumber
        );

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

  // ? get best pokemon to guess next given a list of previously guessed pokemons
  // ? if no pokemon is passed, return the "best initial guess"
  app.get("/guess/best", isLogged, (req, res) => {
    try {
      const { id } = req.query;
      const pokemonIds = (!id ? [] : Array.isArray(id) ? id : [id]).map(Number);
      const bestGuess = getBestPokemonToGuess(pokemonIds);
      res.status(200).send(bestGuess);
    } catch (error) {
      console.error("Error gettings stats", error);
      res.status(500).send("Internal Server Error");
    }
  });
};

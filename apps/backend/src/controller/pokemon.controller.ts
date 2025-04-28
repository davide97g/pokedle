import { NextFunction, Request, Response, type Express } from "express";
import { computeValidationGuess } from "../services/guess.service";
import { searchPokemon } from "../services/pokemon.service";

export const createPokemonController = (app: Express) => {
  // search a pokemon by query
  // optional query param
  // if query is not provided, return first 10 pokemons
  app.get("/pokemon/search", (req, res) => {
    try {
      const query = req.query.query as string | undefined;

      console.info("Searching for pokemon with query", query);

      const searchResult = searchPokemon(query);
      res.send(searchResult);
    } catch (error) {
      console.error("Error searching for pokemon", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // get guess feedback results
  app.post(
    "/pokemon/guess/:pokemonId",
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

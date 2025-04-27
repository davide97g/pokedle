import { Express } from "express";
import { computeValidationGuess } from "../services/guess.service";
import { searchPokemon } from "../services/pokemon.service";
export const createPokemonController = (app: Express) => {
  // search a pokemon by query
  app.get("/pokemon/search/:query", (req, res) => {
    try {
      const { query } = req.params;

      if (!query) {
        return res.status(400).send("Query is required");
      }
      const searchResult = searchPokemon(query);
      res.send(searchResult);
    } catch (error) {
      console.error("Error searching for pokemon", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // get guess feedback results
  app.post("/pokemon/guess/:pokemonId", (req, res) => {
    try {
      const { pokemonId } = req.params;
      if (!pokemonId) {
        return res.status(400).send("Pokemon Id is required");
      }
      const pokemonIdNumber = Number(pokemonId);
      if (isNaN(pokemonIdNumber)) {
        return res.status(400).send("Invalid Pokemon Id");
      }

      const validationGuess = computeValidationGuess(pokemonIdNumber);

      if (!validationGuess) {
        return res.status(400).send("Pokemon not found");
      }
      res.send({
        validationGuess,
      });
    } catch (error) {
      console.error("Error computing the validation of your guess", error);
      res.status(500).send("Internal Server Error");
    }
  });
};

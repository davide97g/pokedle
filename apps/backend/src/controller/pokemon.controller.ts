import { type Express } from "express";
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
};

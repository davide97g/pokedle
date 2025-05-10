import { type Express } from "express";
import { searchPokemon } from "../services/pokemon.service";
import { getUserInfoFromToken } from "../utils/tokenInfo";

export const createPokemonController = (app: Express) => {
  // search a pokemon by query
  // optional query param
  // if query is not provided, return first 10 pokemons
  app.get("/pokemon/search", (req, res) => {
    try {
      const { query, gen } = req.query;
      const user = getUserInfoFromToken(req);
      const searchResult = searchPokemon(
        query as string,
        !user && gen && !isNaN(Number(gen)) ? Number(gen) : undefined
      );
      res.send(searchResult);
    } catch (error) {
      console.error("Error searching for pokemon", error);
      res.status(500).send("Internal Server Error");
    }
  });
};

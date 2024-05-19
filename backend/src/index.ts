import dotenv from "dotenv";
import express from "express";
import { guessPokemon } from "./solver";
import cors from "cors";
import { PokemonValidationGuess } from "../../types/pokemon.model";
import {
  POKEMON_TO_GUESS,
  testGuess,
  getNewPokemonToSolve,
  PokemonList,
} from "./player";

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT;

app.get("/", (_: any, res: any) => {
  res.send("Solvedle Server");
});

app.get("/status", (_: any, res: any) => {
  res.send({
    pokemonToGuess: POKEMON_TO_GUESS,
  });
});

app.get("/pokemon/all", (_: any, res: any) => {
  res.send(PokemonList);
});

app.post("/new-pokemon", express.json(), (req: any, res: any) => {
  const pokemon = getNewPokemonToSolve();
  res.send({ pokemon });
});

app.post("/yesterday-pokemon", express.json(), (req: any, res: any) => {
  const pokemon = req.body;
  const validation = testGuess(pokemon);
  res.send({ validation });
});

app.post("/guess-pokemon/:pokemonId", express.json(), (req: any, res: any) => {
  const pokemonId = req.params.pokemonId;

  const validation = testGuess(pokemonId);
  res.send({ validation });
});

app.post("/best-guess", express.json(), (req: any, res: any) => {
  const validationGuessHistory = req.body as PokemonValidationGuess[];
  const pokemon = guessPokemon(validationGuessHistory);
  res.send({ pokemon });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

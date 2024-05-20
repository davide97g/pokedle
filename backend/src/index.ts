import dotenv from "dotenv";
import express from "express";
import { guessPokemon } from "./solver";
import cors from "cors";
import {
  PokemonSummary,
  PokemonValidationGuess,
} from "../../types/pokemon.model";
import { POKEMON_TO_GUESS, testGuess, getNewPokemonToSolve } from "./player";
import { getPokemonList } from "./data";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:8080", "https://solvedle.vercel.app"],
  })
);
const port = process.env.PORT;

app.get("/", (_: any, res: any) => {
  res.send("Solvedle Server");
});

app.get("/status", (_: any, res: any) => {
  res.send({
    pokemonToGuess: POKEMON_TO_GUESS,
  });
});

app.get("/pokemon/all/:gen", (req: any, res: any) => {
  const gen = req.params.gen;
  const summary: PokemonSummary[] = getPokemonList(gen || "1").map(
    (pokemon) => {
      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
      };
    }
  );
  res.send(summary);
});

app.post("/new-pokemon/:gen", express.json(), (req: any, res: any) => {
  const gen = req.params.gen;
  const pokemon = getNewPokemonToSolve(gen);
  res.send({ pokemon });
});

app.post("/yesterday-pokemon", express.json(), (req: any, res: any) => {
  const pokemon = req.body;
  const validation = testGuess(pokemon);
  res.send({ validation });
});

app.post(
  "/guess-pokemon/:pokemonId/:gen",
  express.json(),
  (req: any, res: any) => {
    const pokemonId = req.params.pokemonId;
    const gen = req.params.gen;
    const validation = testGuess(pokemonId, gen);
    res.send({ validation });
  }
);

app.post("/best-guess/:gen", express.json(), (req: any, res: any) => {
  const validationGuessHistory = req.body as PokemonValidationGuess[];
  const gen = req.params.gen;
  const pokemon = guessPokemon(validationGuessHistory, gen);
  res.send({ pokemon });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

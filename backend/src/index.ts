import dotenv from "dotenv";
import express from "express";
import {
  guessHistoryPokemon,
  guessPokemon,
  guessedFeatures,
  guessedNegativeFeatures,
} from "./solver";
import cors from "cors";
import { PokemonGuess, PokemonNegativeGuess } from "../../types/pokemon.model";

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT;

app.get("/", (_: any, res: any) => {
  res.send("Solvedle Server");
});

app.get("/status", (_: any, res: any) => {
  res.send({
    history: guessHistoryPokemon,
    guessedFeatures,
    guessedNegativeFeatures,
  });
});

app.post("/reset", express.json(), (req: any, res: any) => {
  console.info(req.body);

  guessHistoryPokemon.splice(0, guessHistoryPokemon.length);
  Object.assign(guessedFeatures, {});
  Object.assign(guessedNegativeFeatures, {});
  res.send({ success: true });
});

app.post("/guess", express.json(), (req: any, res: any) => {
  console.info(req.body);
  const { guess, negativeGuess } = req.body as {
    guess: Partial<PokemonGuess>;
    negativeGuess: Partial<PokemonNegativeGuess>;
  };
  Object.assign(guessedFeatures, guess);
  Object.assign(guessedNegativeFeatures, negativeGuess);
  res.send({ success: true, guess });
});

app.get("/suggest", async (_: any, res: any) => {
  const pokemon = guessPokemon();
  res.send({ pokemon });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

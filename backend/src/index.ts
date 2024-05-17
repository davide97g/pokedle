import dotenv from "dotenv";
import express from "express";
import {
  guessHistoryPokemon,
  guessPokemon,
  guessedFeatures,
  guessedNegativeFeatures,
  updateInfo,
} from "./solver";
import cors from "cors";
import { PokemonValidationGuess } from "../../types/pokemon.model";

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
  guessHistoryPokemon.splice(0, guessHistoryPokemon.length);
  Object.assign(guessedFeatures, {});
  Object.assign(guessedNegativeFeatures, {});
  res.send({ success: true });
});

app.post("/guess", express.json(), (req: any, res: any) => {
  const validationGuess = req.body as Partial<PokemonValidationGuess>;
  updateInfo(validationGuess);
  res.send({ success: true });
});

app.get("/suggest", async (_: any, res: any) => {
  const pokemon = guessPokemon();
  res.send({ pokemon });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

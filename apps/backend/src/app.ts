import cors from "cors";
import express from "express";
import { initializeFirebaseApp } from "./config/firebase";
import { createGuessController } from "./controller/guess.controller";
import { createPokemonController } from "./controller/pokemon.controller";
import { createStatsController } from "./controller/stats.controller";

initializeFirebaseApp();

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:8080",
  "https://test.pokedle.online",
  "https://pokedle.online",
  "https://www.pokedle.online",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.get("/", (req, res) => {
  const version = process.env.npm_package_version;
  res.send("Hello World from Pokedle Server! Version: " + version);
});

createPokemonController(app);
createGuessController(app);
createStatsController(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

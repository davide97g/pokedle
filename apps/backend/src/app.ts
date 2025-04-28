import cors from "cors";
import express from "express";
import { initializeFirebaseApp } from "./config/firebase";
import { createPokemonController } from "./controller/pokemon.controller";

initializeFirebaseApp();

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:8080",
  "https://test.pokedle.online",
  "https://pokedle.online",
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

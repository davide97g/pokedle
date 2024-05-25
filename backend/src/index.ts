import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { countRemainingPokemonFromHistory, guessPokemon } from "./solver";
import cors from "cors";
import {
  PokemonSummary,
  PokemonValidationGuess,
} from "../../types/pokemon.model";
import { POKEMON_TO_GUESS, testGuess, getNewPokemonToSolve } from "./player";
import { GENERATION, getPokemonList } from "./data";
import { isAdmin } from "./middleware/admin";
import { isPro } from "./middleware/pro";
import { initializeFirebaseApp } from "./config/firebase";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

initializeFirebaseApp();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://pokedle97.vercel.app",
      "https://pokedle.online",
    ],
  })
);
const port = process.env.PORT;

app.get("/", (_: any, res: any) => {
  res.send("Solvedle Server");
});

app.post("/status/:gen", express.json(), (req: any, res: any) => {
  const gen = req.params.gen;
  const validationGuessHistory = req.body as PokemonValidationGuess[];
  const remainingPokemon = countRemainingPokemonFromHistory(
    validationGuessHistory,
    gen
  );

  res.send({
    remainingPokemon,
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

app.post(
  "/guess-pokemon/:pokemonId/:gen",
  express.json(),
  (req: any, res: any) => {
    const pokemonId = req.params.pokemonId;
    const gen = req.params.gen;
    const validationGuessHistory = req.body as PokemonValidationGuess[];
    const validation = testGuess(pokemonId, gen);
    const remainingPokemon = countRemainingPokemonFromHistory(
      validationGuessHistory,
      gen
    );
    res.send({ validation, remainingPokemon });
  }
);

// **** PRO USERS ****

app.post(
  "/best-guess/:gen",
  [isPro, express.json()],
  (req: Request, res: Response) => {
    const validationGuessHistory = req.body as PokemonValidationGuess[];
    const gen = req.params.gen as GENERATION;
    const pokemon = guessPokemon(validationGuessHistory, gen);
    res.send({ pokemon });
  }
);

// **** ADMIN ****

// ? Create admins
app.post("/create-admin", express.json(), async (req, res) => {
  // Get the ID token passed.
  const idToken = req.body.idToken;

  // Verify the ID token and decode its payload.
  const claims = await getAuth().verifyIdToken(idToken);
  console.log(claims);

  // Verify user is eligible for additional privileges.
  if (
    typeof claims.email !== "undefined" &&
    typeof claims.email_verified !== "undefined" &&
    claims.email_verified &&
    claims.email === "ghiotto.davidenko@gmail.com"
  ) {
    // Add custom claims for additional privileges.
    await getAuth().setCustomUserClaims(claims.sub, {
      admin: true,
    });

    // Tell client to refresh token on user.
    res.end(
      JSON.stringify({
        status: "success",
      })
    );
  } else {
    // Return nothing.
    res.end(JSON.stringify({ status: "ineligible" }));
  }
});

app.post(
  "/new-pokemon/:gen",
  [isAdmin, express.json()],
  (req: Request, res: Response) => {
    const gen = req.params.gen as GENERATION;
    const pokemon = getNewPokemonToSolve(gen);
    res.send({ pokemon });
  }
);

app.post(
  "/status/:gen/admin",
  [isAdmin],
  express.json(),
  (req: Request, res: Response) => {
    const gen = req.params.gen as GENERATION;
    const validationGuessHistory = req.body as PokemonValidationGuess[];
    const remainingPokemon = countRemainingPokemonFromHistory(
      validationGuessHistory,
      gen
    );

    res.send({
      pokemonToGuess: POKEMON_TO_GUESS,
      remainingPokemon,
    });
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

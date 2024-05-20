import {
  PokemonModel,
  PokemonSummary,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { GENERATION } from "../types";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? "http://localhost:3000";

export const API = {
  getStatus: async (
    gen: GENERATION,
    guessFeedbackHistory: PokemonValidationGuess[]
  ) => {
    return fetch(`${BACKEND_URL}/status/${gen}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guessFeedbackHistory),
    })
      .then((res) => res.json())
      .then(
        (res) =>
          res as {
            remainingPokemon: number;
            pokemonToGuess: PokemonModel;
          }
      )
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  getBestSuggestion: async (
    guessValidationHistory: PokemonValidationGuess[],
    gen: GENERATION
  ) => {
    return fetch(`${BACKEND_URL}/best-guess/${gen}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guessValidationHistory),
    })
      .then((res) => res.json())
      .then((res) => res.pokemon as PokemonModel)
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  newPokemon: async (gen: GENERATION) => {
    return fetch(`${BACKEND_URL}/new-pokemon/${gen}`, {
      method: "POST",
    });
  },
  getPokemons: async (gen: GENERATION) => {
    return fetch(`${BACKEND_URL}/pokemon/all/${gen}`)
      .then((res) => res.json())
      .then((res) => res as PokemonSummary[])
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  sendGuessPokemonId: async (
    pokemonId: number,
    gen: GENERATION,
    guessValidationHistory: PokemonValidationGuess[]
  ) => {
    return fetch(`${BACKEND_URL}/guess-pokemon/${pokemonId}/${gen}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guessValidationHistory),
    })
      .then((res) => res.json())
      .then(
        (res) =>
          res as {
            validation: PokemonValidationGuess;
            remainingPokemon: number;
          }
      );
  },
};

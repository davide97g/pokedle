import { Pokemon } from "../../../types/pokemon.types";
import {
  PokemonFeatures,
  PokemonModel,
  PokemonFeaturesNegative,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";

// https://pokeapi.co/

export const getRandomPokemon = async () => {
  const pokemonNumber = Math.max(Math.floor(Math.random() * 600), 1);
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
    .then((res) => res.json() as Promise<Pokemon>)
    .catch((err) => {
      console.info(err);
      return null;
    });
};

export const sendGuess = async (validationGuess: PokemonValidationGuess) => {
  return fetch(`http://localhost:3000/validation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationGuess),
  });
};

export const getStatus = async () => {
  return fetch(`http://localhost:3000/status`)
    .then((res) => res.json())
    .then(
      (res) =>
        res as {
          history: PokemonModel[];
          guessedFeatures: Partial<PokemonFeatures>;
          guessedNegativeFeatures: Partial<PokemonFeaturesNegative>;
          pokemonToGuess: PokemonModel;
        }
    )
    .catch((err) => {
      console.info(err);
      return null;
    });
};

export const getSuggestion = async () => {
  return fetch(`http://localhost:3000/suggest`)
    .then((res) => res.json())
    .then((res) => res.pokemon as PokemonModel)
    .catch((err) => {
      console.info(err);
      return null;
    });
};

export const reset = async () => {
  return fetch(`http://localhost:3000/reset`, {
    method: "POST",
  });
};

export const sendGuessPokemon = async (pokemon: PokemonModel) => {
  return fetch(`http://localhost:3000/guess-pokemon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pokemon),
  })
    .then((res) => res.json())
    .then((res) => res.validation as PokemonValidationGuess);
};

export const getPokemons = async () => {
  return fetch(`http://localhost:3000/pokemon/all`)
    .then((res) => res.json())
    .then((res) => res as PokemonModel[])
    .catch((err) => {
      console.info(err);
      return null;
    });
};

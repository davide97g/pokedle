import {
  PokemonFeatures,
  PokemonModel,
  PokemonFeaturesNegative,
  PokemonValidationGuess,
  PokemonSummary,
} from "../../../types/pokemon.model";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? "http://localhost:3000";

export type GENERATION = "1" | "2" | "3";

// https://pokeapi.co/

export const sendGuess = async (validationGuess: PokemonValidationGuess) => {
  return fetch(`${BACKEND_URL}/validation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationGuess),
  });
};

// TODO: check that has changed
export const getStatus = async () => {
  return fetch(`${BACKEND_URL}/status`)
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
  return fetch(`${BACKEND_URL}/suggest`)
    .then((res) => res.json())
    .then((res) => res.pokemon as PokemonModel)
    .catch((err) => {
      console.info(err);
      return null;
    });
};

export const getBestSuggestion = async (
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
};

export const newPokemon = async (gen: GENERATION) => {
  return fetch(`${BACKEND_URL}/new-pokemon/${gen}`, {
    method: "POST",
  });
};

export const sendGuessPokemon = async (pokemon: PokemonModel) => {
  return fetch(`${BACKEND_URL}/guess-pokemon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pokemon),
  })
    .then((res) => res.json())
    .then((res) => res.validation as PokemonValidationGuess);
};

export const getPokemons = async (gen: GENERATION) => {
  return fetch(`${BACKEND_URL}/pokemon/all/${gen}`)
    .then((res) => res.json())
    .then((res) => res as PokemonSummary[])
    .catch((err) => {
      console.info(err);
      return null;
    });
};

export const sendGuessPokemonId = async (
  pokemonId: number,
  gen: GENERATION
) => {
  return fetch(`${BACKEND_URL}/guess-pokemon/${pokemonId}/${gen}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((res) => res.json())
    .then((res) => res.validation as PokemonValidationGuess);
};

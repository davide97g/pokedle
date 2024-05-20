import {
  PokemonModel,
  PokemonValidationGuess,
} from "../../types/pokemon.model";
import { GENERATION, getPokemonList } from "./data";

const getRandomPokemon = (gen?: GENERATION): PokemonModel => {
  const pokemonList = getPokemonList(gen ?? "1");
  const randomId = Math.floor(Math.random() * pokemonList.length) + 1;
  return pokemonList.find((p) => p.id === randomId)!;
};

export let POKEMON_TO_GUESS = getRandomPokemon();

export const getNewPokemonToSolve = (gen?: GENERATION) => {
  POKEMON_TO_GUESS = getRandomPokemon(gen ?? "1");
  return POKEMON_TO_GUESS;
};

export const getFirstGuess = (gen?: GENERATION): PokemonModel => {
  switch (gen) {
    case "1":
      return getPokemonList("1").find((p) => p.id === 61)!;
    case "2":
      return getPokemonList("2").find((p) => p.id === 77)!;
    case "3":
    default:
      return getPokemonList("3").find((p) => p.id === 287)!;
  }
}

const computeComparison = (
  value?: number,
  guess?: number
): "greater" | "less" | "equal" => {
  if (!value || !guess) {
    return "equal";
  }

  if (value > guess) {
    return "greater";
  } else if (value < guess) {
    return "less";
  } else {
    return "equal";
  }
};

export const testGuess = (
  pokemonGuessId: string,
  gen?: GENERATION
): PokemonValidationGuess => {
  const pokemonGuess = getPokemonList(gen ?? "1").find(
    (p) => p.id === Number(pokemonGuessId)
  );
  if (!pokemonGuess) {
    throw new Error("Pokemon not found");
  }
  return {
    id: pokemonGuess.id,
    type1: {
      value: pokemonGuess.type1,
      valid: pokemonGuess.type1 === POKEMON_TO_GUESS?.type1,
    },
    type2: {
      value: pokemonGuess.type2,
      valid: pokemonGuess.type2 === POKEMON_TO_GUESS?.type2,
    },
    color: {
      value: pokemonGuess.color,
      valid: pokemonGuess.color === POKEMON_TO_GUESS?.color,
    },
    habitat: {
      value: pokemonGuess.habitat,
      valid: pokemonGuess.habitat === POKEMON_TO_GUESS?.habitat,
    },
    height: {
      value: pokemonGuess.height,
      comparison: computeComparison(
        POKEMON_TO_GUESS?.height,
        pokemonGuess?.height
      ),
    },
    weight: {
      value: pokemonGuess.weight,
      comparison: computeComparison(
        POKEMON_TO_GUESS?.weight,
        pokemonGuess?.weight
      ),
    },
    evolutionStage: {
      value: pokemonGuess.evolutionStage,
      comparison: computeComparison(
        POKEMON_TO_GUESS?.evolutionStage,
        pokemonGuess?.evolutionStage
      ),
    },
  };
};

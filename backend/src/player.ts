import {
  PokemonModel,
  PokemonValidationGuess,
} from "../../types/pokemon.model";
import database from "../../database/data/pokemon-model.json";

const PokemonList = database as PokemonModel[];

const getRandomPokemon = (previousId?: number): PokemonModel => {
  const randomId = Math.floor(Math.random() * PokemonList.length) + 1;
  if (randomId === previousId) {
    return getRandomPokemon(previousId);
  }
  return PokemonList.find((p) => p.id === randomId)!;
};

export let POKEMON_TO_GUESS = getRandomPokemon();

const getNewPokemonToSolve = () => {
  POKEMON_TO_GUESS = getRandomPokemon();
  return POKEMON_TO_GUESS;
};

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
  pokemonGuess: PokemonModel
): PokemonValidationGuess => {
  return {
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

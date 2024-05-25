import { PokemonValidationGuess } from "../../../../types/pokemon.model";
import { GENERATION, getPokemonList } from "../../data";
import { DAILY_POKEMONS } from "./manager";

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

  if (!DAILY_POKEMONS?.pokemonList.length) {
    throw new Error("Pokemon list not found");
  }

  const POKEMON_TO_GUESS = DAILY_POKEMONS.pokemonList.find(
    (p) => p.gen === gen
  )?.pokemon;

  if (!POKEMON_TO_GUESS) {
    throw new Error("Pokemon to guess not found");
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
    generation: {
      value: pokemonGuess.generation,
      comparison: computeComparison(
        POKEMON_TO_GUESS?.generation,
        pokemonGuess?.generation
      ),
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

import dayjs from "dayjs";
import { PokemonValidationGuess } from "../../../../types/pokemon.model";
import { GENERATION } from "../../../../types/user.types";
import { getPokemonList } from "../../data";
import { incrementCounter } from "../counter";
import { DayStats } from "./manager";

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

const hasWon = (guess: PokemonValidationGuess): boolean => {
  return Boolean(
    guess.type1.valid &&
      guess.type2.valid &&
      guess.color.valid &&
      guess.habitat.valid &&
      guess.generation.comparison === "equal" &&
      guess.height.comparison === "equal" &&
      guess.weight.comparison === "equal" &&
      guess.evolutionStage.comparison === "equal"
  );
};

export const testGuess = async (
  pokemonGuessId: string,
  gen?: GENERATION
): Promise<{
  validationGuess: PokemonValidationGuess;
  isWinningGuess: boolean;
}> => {
  const pokemonGuess = getPokemonList(gen ?? "1").find(
    (p) => p.id === Number(pokemonGuessId)
  );
  if (!pokemonGuess) {
    throw new Error("Pokemon not found");
  }

  if (!DayStats?.pokemonList.length) {
    throw new Error("Pokemon list not found");
  }

  const POKEMON_TO_GUESS = DayStats.pokemonList.find(
    (p) => p.gen === gen
  )?.pokemon;

  if (!POKEMON_TO_GUESS) {
    throw new Error("Pokemon to guess not found");
  }

  const validationGuess: PokemonValidationGuess = {
    id: pokemonGuess.id,
    date: dayjs().format("YYYY-MM-DD"),
    name: pokemonGuess.name,
    image: pokemonGuess.image,
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

  const isWinningGuess = hasWon(validationGuess);
  if (isWinningGuess) await incrementCounter();

  return { validationGuess, isWinningGuess };
};

import dayjs from "dayjs";
import { PokemonValidationGuess } from "../../../types/pokemon.model";
import { getDatabase } from "../config/database";
import { POKEMON_TO_GUESS_ID } from "./dailyGuess";

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

export const testGuess = async ({
  pokemonGuessId,
}: {
  pokemonGuessId: number;
}): Promise<{
  validationGuess: PokemonValidationGuess;
}> => {
  const database = await getDatabase();
  const pokemonGuess = database.find((p) => p.id === pokemonGuessId);
  if (!pokemonGuess) {
    throw new Error("Pokemon not found");
  }

  const POKEMON_TO_GUESS = database.find((p) => p.id === POKEMON_TO_GUESS_ID);

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

  return { validationGuess };
};

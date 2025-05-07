import { PokemonModel, PokemonValidationGuess } from "@pokedle/types";
import dayjs from "dayjs";
import { getDatabase } from "../config/database";
import { getPokemonIdToGuess } from "../data/hidden";
import { addWinningForUser } from "./stats.service";

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

export async function guessPokemon(
  pokemonGuessId: number,
  user:
    | {
        id: string;
        name: string;
        image?: string;
      }
    | undefined,
  guessNumber: number
): Promise<PokemonValidationGuess> {
  const database = getDatabase();
  // Find the pokemon guess in the database
  const pokemonGuess = database.find((p) => p.id === pokemonGuessId);
  if (!pokemonGuess) {
    throw new Error("Pokemon not found");
  }

  const HIDDEN_POKEMON_ID = await getPokemonIdToGuess();

  const POKEMON_TO_GUESS = database.find((p) => p.id === HIDDEN_POKEMON_ID);

  if (!POKEMON_TO_GUESS) {
    throw new Error("Pokemon to guess not found");
  }

  const { validationGuess, correct } = computeValidationFeedback(
    pokemonGuess,
    POKEMON_TO_GUESS
  );

  // Check if the guess is correct
  if (user?.id && correct)
    await addWinningForUser(
      {
        userId: user.id,
        date: dayjs().format("YYYY-MM-DD"),
        guesses: guessNumber,
        pokemonId: HIDDEN_POKEMON_ID,
      },
      user
    );

  return validationGuess;
}

export function computeValidationFeedback(
  pokemonGuessed: PokemonModel,
  pokemonHidden: PokemonModel
): { validationGuess: PokemonValidationGuess; correct: boolean } {
  const validationGuess: PokemonValidationGuess = {
    id: pokemonGuessed.id,
    date: dayjs().format("YYYY-MM-DD"),
    name: pokemonGuessed.name,
    image: pokemonGuessed.image,
    type1: {
      value: pokemonGuessed.type1,
      valid: pokemonGuessed.type1 === pokemonHidden?.type1,
    },
    type2: {
      value: pokemonGuessed.type2,
      valid: pokemonGuessed.type2 === pokemonHidden?.type2,
    },
    color: {
      value: pokemonGuessed.color,
      valid: pokemonGuessed.color === pokemonHidden?.color,
    },
    habitat: {
      value: pokemonGuessed.habitat,
      valid: pokemonGuessed.habitat === pokemonHidden?.habitat,
    },
    generation: {
      value: pokemonGuessed.generation,
      comparison: computeComparison(
        pokemonHidden?.generation,
        pokemonGuessed?.generation
      ),
    },
    height: {
      value: pokemonGuessed.height,
      comparison: computeComparison(
        pokemonHidden?.height,
        pokemonGuessed?.height
      ),
    },
    weight: {
      value: pokemonGuessed.weight,
      comparison: computeComparison(
        pokemonHidden?.weight,
        pokemonGuessed?.weight
      ),
    },
    evolutionStage: {
      value: pokemonGuessed.evolutionStage,
      comparison: computeComparison(
        pokemonHidden?.evolutionStage,
        pokemonGuessed?.evolutionStage
      ),
    },
  };
  return {
    validationGuess,
    correct: pokemonGuessed.id === pokemonHidden.id,
  };
}

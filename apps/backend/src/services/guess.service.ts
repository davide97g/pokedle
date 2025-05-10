import { FEATURE, PokemonModel, PokemonValidationGuess } from "@pokedle/types";
import dayjs from "dayjs";
import { getDatabase } from "../config/database";
import { getPokemonIdToGuess } from "../data/hidden";
import {
  filterOutPokemonByNegativeFeatures,
  findOptimalPokemon,
  generateInfo,
} from "./algo.service";
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
  guessNumber: number,
  gen?: number
): Promise<PokemonValidationGuess> {
  const database = getDatabase();
  // Find the pokemon guess in the database
  const pokemonGuess = database.find((p) => p.id === pokemonGuessId);
  if (!pokemonGuess) {
    throw new Error("Pokemon not found");
  }

  const HIDDEN_POKEMON_ID = await getPokemonIdToGuess(gen ?? 1);

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

/**
 * Compute the feedback history for a list of pokemon guesses
 * it takes a list of pokemon ids and returns a list of feedbacks.
 * Has **knowledge** of the **pokemon to guess**
 * @param guessHistoryIdList
 * @returns
 */
// ?
export async function computeFeedbackHistory(
  guessHistoryIdList: number[],
  gen?: number
) {
  const database = getDatabase();
  // ? here we are retrieving the pokemon to guess from the database, but it is not required
  const HIDDEN_POKEMON_ID = await getPokemonIdToGuess(gen ?? 1);
  const POKEMON_TO_GUESS = database.find((p) => p.id === HIDDEN_POKEMON_ID);
  if (!POKEMON_TO_GUESS) {
    throw new Error("Pokemon to guess not found");
  }
  const feedbackHistory = guessHistoryIdList
    .map((id) => database.find((p) => p.id === id))
    .map((pokemon) => computeValidationFeedback(pokemon!, POKEMON_TO_GUESS));
  // If the user has already guessed the pokemon, return that pokemon
  const correctPokemon = feedbackHistory.find((v) => v.correct);
  return {
    correctPokemon: database.find(
      (p) => p.id === correctPokemon?.validationGuess.id
    )!,
    feedbackHistory,
  };
}

/**
 * Given a list of previously guessed pokemons, return the best pokemon to guess next.
 * **Does not require knowledge of the pokemon to guess**.
 * @param validationGuessHistory
 * @returns
 */
export async function getBestPokemonToGuess(
  validationGuessHistory: PokemonValidationGuess[]
): Promise<PokemonModel | null> {
  const database = getDatabase();

  // Filter out the pokemons that have been guessed
  const guessedPokemonIds = validationGuessHistory.map((v) => v.id);
  const pokemonStillToGuess = database.filter(
    (p) => !guessedPokemonIds.includes(p.id)
  );

  // Given a list of feedbacks, generate the guessed features and negative features
  // based on what we know is true or false
  const { guessedFeatures, guessedNegativeFeatures } = generateInfo(
    validationGuessHistory
  );

  // Find out the pokemons that have the guessed features
  const guessedFeaturesKeys = Object.keys(guessedFeatures) as FEATURE[];
  const pokemonWithCorrectFeatures = pokemonStillToGuess.filter((p) =>
    guessedFeaturesKeys.every((key) => p[key] === guessedFeatures[key])
  );

  // Find out the pokemons that have the guessed negative features
  const remainingFeatures = Object.keys(guessedNegativeFeatures).filter(
    (k) => !guessedFeaturesKeys.includes(k as FEATURE)
  ) as FEATURE[];
  const pokemonFiltered = filterOutPokemonByNegativeFeatures(
    pokemonWithCorrectFeatures,
    guessedNegativeFeatures
  );

  // Find the pokemon that if guessed will give the most information
  // about the remaining features
  // The idea is to find the pokemon that has the most different values for the remaining features
  // and that is not already guessed
  // This will give us the most information about the remaining features
  // and will help us to narrow down the list of pokemons
  // to guess next
  const bestPokemonToGuess = findOptimalPokemon(
    pokemonFiltered,
    remainingFeatures
  );

  return bestPokemonToGuess;
}

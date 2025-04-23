import { PokemonValidationGuess } from "@pokedle/types";
import { testGuess } from "./utils";

export const sendGuessPokemonId = async (
  pokemonId: number,
  guessFeedbackHistory: PokemonValidationGuess[]
) => {
  const { validationGuess } = await testGuess({
    pokemonGuessId: pokemonId,
  });
  validationGuess.order = guessFeedbackHistory.length + 1;

  return { validation: validationGuess };
};

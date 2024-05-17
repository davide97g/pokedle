import { PokemonValidationGuess } from "../../types/pokemon.model";

const validationOptions = [true, false];
const comparisonOptions = ["equal", undefined];

export const COMPARISON_KEYS = ["evolutionStage", "height", "weight"];

export function generateCombinations(
  defaultObject: Partial<PokemonValidationGuess>
): Partial<PokemonValidationGuess>[] {
  const combinations: Partial<PokemonValidationGuess>[] = [];
  const keys = Object.keys(defaultObject);

  function recurse(
    currentObject: Partial<PokemonValidationGuess>,
    keyIndex: number
  ) {
    if (keyIndex === keys.length) {
      combinations.push(JSON.parse(JSON.stringify(currentObject)));
      return;
    }

    const key = keys[keyIndex];

    if (!COMPARISON_KEYS.includes(key)) {
      for (const validOption of validationOptions) {
        (currentObject as any)[key].valid = validOption;
        recurse(currentObject, keyIndex + 1);
      }
    } else {
      for (const comparisonOption of comparisonOptions) {
        (currentObject as any)[key].comparison = comparisonOption;
        recurse(currentObject, keyIndex + 1);
      }
    }
  }

  recurse(JSON.parse(JSON.stringify(defaultObject)), 0);

  return combinations;
}

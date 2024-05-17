import {
  PokemonModel,
  PokemonFeaturesNegative,
  PokemonValidationGuess,
  FEATURE,
} from "../../types/pokemon.model";

import database from "../../database/data/pokemon-model.json";
import { generateCombinations } from "./combinations";

export const guessHistoryPokemon: PokemonModel[] = [];

export const guessedFeatures: Partial<PokemonModel> = {};
export const guessedNegativeFeatures: Partial<PokemonFeaturesNegative> = {
  type1: [],
  type2: [],
  habitat: [],
  color: [],
  evolutionStage: { min: 0, max: Infinity },
  height: { min: 0, max: Infinity },
  weight: { min: 0, max: Infinity },
};

export const PokemonList = database as PokemonModel[];

export const updateInfo = (
  validationGuess: Partial<PokemonValidationGuess>
) => {
  // *** Positive Features ***
  if (validationGuess.type1?.valid)
    guessedFeatures.type1 = validationGuess.type1?.value;
  if (validationGuess.type2?.valid)
    guessedFeatures.type2 = validationGuess.type2?.value;
  if (validationGuess.habitat?.valid)
    guessedFeatures.habitat = validationGuess.habitat?.value;
  if (validationGuess.color?.valid)
    guessedFeatures.color = validationGuess.color?.value;
  if (validationGuess.evolutionStage?.comparison === "equal")
    guessedFeatures.evolutionStage = validationGuess.evolutionStage?.value;
  if (validationGuess.height?.comparison === "equal")
    guessedFeatures.height = validationGuess.height?.value;
  if (validationGuess.weight?.comparison === "equal")
    guessedFeatures.weight = validationGuess.weight?.value;

  // *** Negative Features ***
  guessedNegativeFeatures.type1 = guessedNegativeFeatures.type1 || [];
  guessedNegativeFeatures.type2 = guessedNegativeFeatures.type2 || [];
  guessedNegativeFeatures.habitat = guessedNegativeFeatures.habitat || [];
  guessedNegativeFeatures.color = guessedNegativeFeatures.color || [];
  guessedNegativeFeatures.evolutionStage =
    guessedNegativeFeatures.evolutionStage || { min: 0, max: Infinity };
  guessedNegativeFeatures.height = guessedNegativeFeatures.height || {
    min: 0,
    max: Infinity,
  };
  guessedNegativeFeatures.weight = guessedNegativeFeatures.weight || {
    min: 0,
    max: Infinity,
  };

  if (!validationGuess.type1?.valid)
    guessedNegativeFeatures.type1 = [
      ...new Set([
        ...guessedNegativeFeatures.type1,
        validationGuess.type1?.value as string,
      ]),
    ];

  if (!validationGuess.type2?.valid)
    guessedNegativeFeatures.type2 = [
      ...new Set([
        ...guessedNegativeFeatures.type2,
        validationGuess.type2?.value as string,
      ]),
    ];

  if (!validationGuess.habitat?.valid)
    guessedNegativeFeatures.habitat = [
      ...new Set([
        ...guessedNegativeFeatures.habitat,
        validationGuess.habitat?.value as string,
      ]),
    ];

  if (!validationGuess.color?.valid)
    guessedNegativeFeatures.color = [
      ...new Set([
        ...guessedNegativeFeatures.color,
        validationGuess.color?.value as string,
      ]),
    ];

  if (validationGuess.evolutionStage?.comparison !== "equal") {
    const value = validationGuess.evolutionStage?.value as number;
    if (validationGuess.evolutionStage?.comparison === "greater")
      guessedNegativeFeatures.evolutionStage.min = Math.max(
        guessedNegativeFeatures.evolutionStage.min,
        value
      );
    else
      guessedNegativeFeatures.evolutionStage.max = Math.min(
        guessedNegativeFeatures.evolutionStage.max,
        value
      );
  }

  if (validationGuess.height?.comparison !== "equal") {
    const value = validationGuess.height?.value as number;
    if (validationGuess.height?.comparison === "greater")
      guessedNegativeFeatures.height.min = Math.max(
        guessedNegativeFeatures.height.min,
        value
      );
    else
      guessedNegativeFeatures.height.max = Math.min(
        guessedNegativeFeatures.height.max,
        value
      );
  }

  if (validationGuess.weight?.comparison !== "equal") {
    const value = validationGuess.weight?.value as number;
    if (validationGuess.weight?.comparison === "greater")
      guessedNegativeFeatures.weight.min = Math.max(
        guessedNegativeFeatures.weight.min,
        value
      );
    else
      guessedNegativeFeatures.weight.max = Math.min(
        guessedNegativeFeatures.weight.max,
        value
      );
  }
};

const countRemainingPokemonWithGuess = (
  validationGuess: Partial<PokemonValidationGuess>,
  pokemonList: PokemonModel[]
) => {
  const features = Object.keys(validationGuess) as FEATURE[];

  const pokemonFiltered = pokemonList.filter((p) =>
    features.every((feature) => {
      const guess = validationGuess[feature] as {
        value: string | number;
        valid: boolean | undefined;
        comparison: "greater" | "less" | "equal" | undefined;
      };
      const isValid = guess?.valid || guess?.comparison === "equal";
      if (isValid) return p[feature] === guess.value;
      else return p[feature] !== guess.value;
    })
  );

  return pokemonFiltered.length;
};

const createGuessList = (
  pokemon: PokemonModel,
  remainingFeatures: FEATURE[]
): Partial<PokemonValidationGuess>[] => {
  const templateGuess: Partial<PokemonValidationGuess> = {};
  // template guess
  remainingFeatures.forEach((feature) => {
    templateGuess[feature] = {
      value: pokemon[feature],
      valid: undefined,
      comparison: undefined,
    } as any;
  });

  const combs = generateCombinations(templateGuess);
  return combs;
};

// for a give pokemon simulate all the possibile scenarios with every features potentially guessed or not
const computeAvgScore = (
  pokemon: PokemonModel,
  remainingFeatures: FEATURE[],
  pokemonList: PokemonModel[]
): number => {
  let totalScore = 0;
  let count = 0;

  const guessList = createGuessList(pokemon, remainingFeatures);

  guessList.forEach((guess) => {
    const score = countRemainingPokemonWithGuess(guess, pokemonList);
    totalScore += score;
    if (score > 0) count++;
  });

  return totalScore / (count || 1);
};

// 7 features, 2 possibilities for each feature, 2^7 = 128 possibilities
// 150 pokemons, 150 * 128 = 19200 possibilities
const findOptimalPokemon = (
  pokemonList: PokemonModel[],
  remainingFeatures: FEATURE[]
) => {
  const pokemonScores: { pokemonId: number; avg: number; name: string }[] = [];

  pokemonList.forEach((pokemon) => {
    const avg = computeAvgScore(pokemon, remainingFeatures, pokemonList);
    pokemonScores.push({ pokemonId: pokemon.id, avg, name: pokemon.name });
  });

  pokemonScores.sort((a, b) => a.avg - b.avg);
  if (pokemonScores.length === 0) return null;

  console.log(structuredClone(pokemonScores).splice(0, 10));
  const bestPokemonId = pokemonScores[0].pokemonId;

  return pokemonList.find((p) => p.id === bestPokemonId);
};

export const guessPokemon = () => {
  const guessedPokemonIds = guessHistoryPokemon.map((p) => p.id);
  // Filter out the pokemons that have been guessed
  const pokemonStillToGuess = PokemonList.filter(
    (p) => !guessedPokemonIds.includes(p.id)
  );

  //  Filter out the pokemons that have the guessed features
  const guessedFeaturesKeys = Object.keys(guessedFeatures) as FEATURE[];
  const pokemonWithCorrectFeatures = pokemonStillToGuess.filter((p) =>
    guessedFeaturesKeys.every((key) => p[key] === guessedFeatures[key])
  );

  const pokemonFiltered = pokemonWithCorrectFeatures.filter((p) =>
    Object.entries(guessedNegativeFeatures).every(([key, value]) => {
      if (Array.isArray(value)) {
        return !value.includes((p as any)[key]);
      } else {
        return (
          (!value.min || (p as any)[key] > value.min) &&
          (!value.max || (p as any)[key] < value.max)
        );
      }
    })
  );

  const remainingFeatures = Object.keys(guessedNegativeFeatures).filter(
    (k) => !guessedFeaturesKeys.includes(k as FEATURE)
  ) as FEATURE[];

  const bestPokemonToGuess = findOptimalPokemon(
    pokemonFiltered,
    remainingFeatures
  );
  if (bestPokemonToGuess) guessHistoryPokemon.push(bestPokemonToGuess);
  return bestPokemonToGuess;
};

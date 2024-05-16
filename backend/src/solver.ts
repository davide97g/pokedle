import { PokemonModel, PokemonNegativeGuess } from "../../types/pokemon.model";

import database from "../../database/data/pokemon-model.json";

export const guessHistoryPokemon: PokemonModel[] = [];

export const guessedFeatures: Partial<PokemonModel> = {};
export const guessedNegativeFeatures: Partial<PokemonNegativeGuess> = {};

const PokemonList = database as PokemonModel[];

type FEATURE = keyof PokemonModel;

function findOptimalSplit(pokemonList: PokemonModel[]) {
  // List of features to consider for the split
  const features: FEATURE[] = [
    "color",
    "habitat",
    "evolutionStage",
    "type1",
    "type2",
    "height",
    "weight",
  ];

  // Function to calculate the score of a split
  function calculateSplitScore(
    subset1: PokemonModel[],
    subset2: PokemonModel[]
  ) {
    return Math.abs(subset1.length - subset2.length);
  }

  // Function to split the list based on a given feature and value
  function splitByFeature(
    list: PokemonModel[],
    feature: FEATURE,
    value: number
  ) {
    if (typeof value === "number") {
      const subset1 = list.filter(
        (pokemon) => (pokemon[feature] as number) <= value
      );
      const subset2 = list.filter(
        (pokemon) => (pokemon[feature] as number) > value
      );
      return { subset1, subset2 };
    } else {
      const subset1 = list.filter((pokemon) => pokemon[feature] === value);
      const subset2 = list.filter((pokemon) => pokemon[feature] !== value);
      return { subset1, subset2 };
    }
  }

  // Find the optimal split
  let bestFeature = null;
  let bestValue = null;
  let bestScore = Infinity;
  const bestSplit: {
    subset1: PokemonModel[];
    subset2: PokemonModel[];
  } = {
    subset1: [],
    subset2: [],
  };

  features.forEach((feature) => {
    // Get unique values of the feature
    const values: number[] = [
      ...new Set(pokemonList.map((pokemon) => pokemon[feature] as number)),
    ];

    values.forEach((value) => {
      const { subset1, subset2 } = splitByFeature(pokemonList, feature, value);
      const score = calculateSplitScore(subset1, subset2);

      if (score < bestScore) {
        bestScore = score;
        bestFeature = feature;
        bestValue = value;
        bestSplit.subset1 = subset1;
        bestSplit.subset2 = subset2;
      }
    });
  });

  return {
    bestFeature,
    bestValue,
    bestScore,
    subset1: bestSplit?.subset1,
    subset2: bestSplit?.subset2,
  };
}

export const guessPokemon = (): PokemonModel => {
  const guessedPokemonIds = guessHistoryPokemon.map((p) => p.id);
  const unguessedPokemons = PokemonList.filter(
    (p) => !guessedPokemonIds.includes(p.id)
  );

  const guessedFeaturesKeys = Object.keys(guessedFeatures) as FEATURE[];
  const filteredPokemonByGuessedFeatures = unguessedPokemons.filter((p) =>
    guessedFeaturesKeys.every((key) => p[key] === guessedFeatures[key])
  );

  const filteredPokemonByNegativeGuessedFeatures =
    filteredPokemonByGuessedFeatures.filter((p) =>
      Object.entries(guessedNegativeFeatures).every(([key, value]) => {
        if (Array.isArray(value)) {
          return !value.includes((p as any)[key]);
        } else {
          return (p as any)[key] < value.min || (p as any)[key] > value.max;
        }
      })
    );

  const result = findOptimalSplit(filteredPokemonByNegativeGuessedFeatures);

  console.log("Best Feature:", result.bestFeature);
  console.log("Best Value:", result.bestValue);
  console.log("Subset 1:", result.subset1.length);
  console.log("Subset 2:", result.subset2.length);

  const randomPokemon =
    result.subset1.length > result.subset2.length
      ? result.subset1[Math.floor(Math.random() * result.subset1.length)]
      : result.subset2[Math.floor(Math.random() * result.subset2.length)];

  guessHistoryPokemon.push(randomPokemon);
  return randomPokemon;
};

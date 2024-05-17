import {
  PokemonModel,
  PokemonFeaturesNegative,
  PokemonValidationGuess,
  FEATURE,
} from "../../types/pokemon.model";

import database from "../../database/data/pokemon-model.json";

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

let PokemonList = database as PokemonModel[];

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

// for a give pokemon simulate all the possibile scenarios with every features potentially guessed or not
const computeAvgScore = (
  pokemon: PokemonModel,
  remainingFeatures: FEATURE[],
  pokemonList: PokemonModel[]
): number => {
  const totalPossibilities = 2 ** remainingFeatures.length;
  let totalScore = 0;
  remainingFeatures.forEach((feature) => {
    let score = 0;
    const pokemonFeatureValue = pokemon[feature];
    const pokemonFeatureCount = pokemonList.filter(
      (p) => p[feature] === pokemonFeatureValue
    ).length;
    const pokemonFeatureCountInverse = pokemonList.filter(
      (p) => p[feature] !== pokemonFeatureValue
    ).length;

    // if the feature is present
    score += pokemonFeatureCount;

    // if the feature is not present
    score += pokemonFeatureCountInverse;

    totalScore += score;
  });

  return totalScore / totalPossibilities;
};

// 7 features, 2 possibilities for each feature, 2^7 = 128 possibilities
// 150 pokemons, 150 * 128 = 19200 possibilities
const findOptimalPokemon = (
  pokemonList: PokemonModel[],
  remainingFeatures: FEATURE[]
): PokemonModel => {
  const pokemonScores: { pokemonId: number; avg: number }[] = [];

  pokemonList.forEach((pokemon) => {
    const avg = computeAvgScore(pokemon, remainingFeatures, pokemonList);
    pokemonScores.push({ pokemonId: pokemon.id, avg });
  });

  console.info(pokemonScores);

  const bestPokemonId = pokemonScores.sort((a, b) => a.avg - b.avg)?.[0]
    .pokemonId;
  return pokemonList.find((p) => p.id === bestPokemonId) as PokemonModel;
};

export const guessPokemon = (): PokemonModel => {
  const guessedPokemonIds = guessHistoryPokemon.map((p) => p.id);
  // Filter out the pokemons that have been guessed
  PokemonList = PokemonList.filter((p) => !guessedPokemonIds.includes(p.id));

  //  Filter out the pokemons that have the guessed features
  const guessedFeaturesKeys = Object.keys(guessedFeatures) as FEATURE[];
  PokemonList = PokemonList.filter((p) =>
    guessedFeaturesKeys.every((key) => p[key] === guessedFeatures[key])
  );
  console.info(PokemonList);

  PokemonList = PokemonList.filter((p) =>
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

  const bestPokemonToGuess = findOptimalPokemon(PokemonList, remainingFeatures);
  return bestPokemonToGuess;
};

import { GENERATION } from "./user.types";

export interface PokemonModel {
  id: number;
  name: string;
  type1: string;
  type2: string;
  generation: number;
  height: number;
  weight: number;
  image: string;
  color: string;
  evolutionStage: number;
  habitat: string;
}

export interface PokemonSummary {
  id: number;
  name: string;
  image: string;
}

export type FEATURE =
  | "type1"
  | "type2"
  | "color"
  | "habitat"
  | "generation"
  | "height"
  | "weight"
  | "evolutionStage";

export type ValidationComparison = "greater" | "less" | "equal";
export interface PokemonValidationGuess {
  id: number;
  date: string;
  name: string;
  image: string;
  order?: number;
  type1: {
    value: string;
    valid: boolean | undefined;
  };
  type2: {
    value: string;
    valid: boolean | undefined;
  };
  color: {
    value: string;
    valid: boolean | undefined;
  };
  habitat: {
    value: string;
    valid: boolean | undefined;
  };
  generation: {
    value: number;
    comparison: ValidationComparison | undefined;
  };
  height: {
    value: number;
    comparison: ValidationComparison | undefined;
  };
  weight: {
    value: number;
    comparison: ValidationComparison | undefined;
  };
  evolutionStage: {
    value: number;
    comparison: ValidationComparison | undefined;
  };
}

export interface PokemonFeatures {
  type1?: string;
  type2?: string;
  color?: string;
  habitat?: string;
  evolutionStage?: number;
  generation?: number;
  height?: number;
  weight?: number;
}

export interface PokemonFeaturesNegative {
  type1: string[];
  type2: string[];
  color: string[];
  habitat: string[];
  generation: {
    min: number;
    max: number;
  };
  height: {
    min: number;
    max: number;
  };
  weight: {
    min: number;
    max: number;
  };
  evolutionStage: {
    min: number;
    max: number;
  };
}

export interface PokedleDayStats {
  pokemonList: { gen: GENERATION; pokemon: PokemonModel; sid: string }[];
  date: string;
  totalGuesses: number;
}

export interface PokedleCustomGuess {
  pokemonList: { gen: GENERATION; pokemon: PokemonModel }[];
}

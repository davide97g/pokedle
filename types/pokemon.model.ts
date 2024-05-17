export interface PokemonModel {
  id: number;
  name: string;
  type1: string;
  type2: string;
  height: number;
  weight: number;
  sprite: string;
  color: string;
  evolutionStage: number;
  habitat: string;
}

export type ValidationComparison = "greater" | "less" | "equal";
export interface PokemonValidationGuess {
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
  height: {
    value: number;
    comparison: ValidationComparison;
  };
  weight: {
    value: number;
    comparison: ValidationComparison;
  };
  evolutionStage: {
    value: number;
    comparison: ValidationComparison;
  };
}

export interface PokemonGuess {
  type1?: string;
  type2?: string;
  height?: number;
  weight?: number;
  color?: string;
  evolutionStage?: number;
  habitat?: string;
}

export interface PokemonNegativeGuess {
  type1List: string[];
  type2List: string[];
  height: {
    min: number;
    max: number;
  };
  weight: {
    min: number;
    max: number;
  };
  colorList: string[];
  evolutionStage: {
    min: number;
    max: number;
  };
  habitatList: string[];
}

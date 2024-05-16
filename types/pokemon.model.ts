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

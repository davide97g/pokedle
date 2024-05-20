import { PokemonModel } from "../../types/pokemon.model";
import database from "../../database/data/pokemon-model.json";

const FIRST_GEN = 151;
const SECOND_GEN = 251;
const THIRD_GEN = 386;

const POKEMON_LIST: PokemonModel[] = database as PokemonModel[];

export type GENERATION = "1" | "2" | "3";

export const getPokemonList = (gen?: GENERATION): PokemonModel[] => {
  switch (gen) {
    case "1":
      return POKEMON_LIST.filter((p) => p.id <= FIRST_GEN);
    case "2":
      return POKEMON_LIST.filter((p) => p.id <= SECOND_GEN);
    case "3":
    default:
      return POKEMON_LIST.filter((p) => p.id <= THIRD_GEN);
  }
};

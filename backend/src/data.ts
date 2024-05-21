import { PokemonModel } from "../../types/pokemon.model";
import database from "../data/pokemon-model.json";

const FIRST_GEN = 151;
const SECOND_GEN = 251;
const THIRD_GEN = 386;
const FOURTH_GEN = 493;
const FIFTH_GEN = 649;
const SIXTH_GEN = 721;
const SEVENTH_GEN = 809;
const EIGHTH_GEN = 905;
const NINTH_GEN = 1025;

const POKEMON_LIST: PokemonModel[] = database as PokemonModel[];

export type GENERATION = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export const getPokemonList = (gen?: GENERATION): PokemonModel[] => {
  switch (gen) {
    case "2":
      return POKEMON_LIST.filter((p) => p.id <= SECOND_GEN);
    case "3":
      return POKEMON_LIST.filter((p) => p.id <= THIRD_GEN);
    case "4":
      return POKEMON_LIST.filter((p) => p.id <= FOURTH_GEN);
    case "5":
      return POKEMON_LIST.filter((p) => p.id <= FIFTH_GEN);
    case "6":
      return POKEMON_LIST.filter((p) => p.id <= SIXTH_GEN);
    case "7":
      return POKEMON_LIST.filter((p) => p.id <= SEVENTH_GEN);
    case "8":
      return POKEMON_LIST.filter((p) => p.id <= EIGHTH_GEN);
    case "9":
      return POKEMON_LIST.filter((p) => p.id <= NINTH_GEN);
    case "1":
    default:
      return POKEMON_LIST.filter((p) => p.id <= FIRST_GEN);
  }
};

export const BEST_FIRST_GUESS: {
  [key: string]: PokemonModel | undefined;
} = {
  "1": POKEMON_LIST.find((p) => p.id === 61), // Poliwhirl
  "2": POKEMON_LIST.find((p) => p.id === 161), // Sentret
  "3": POKEMON_LIST.find((p) => p.id === 8), // Wartortle
  "4": POKEMON_LIST.find((p) => p.id === 61), // Poliwhirl
  "5": POKEMON_LIST.find((p) => p.id === 61), // Poliwhirl
  "6": POKEMON_LIST.find((p) => p.id === 61), // Poliwhirl
  "7": POKEMON_LIST.find((p) => p.id === 117), // Seadra
  "8": POKEMON_LIST.find((p) => p.id === 61), // Poliwhirl
  "9": POKEMON_LIST.find((p) => p.id === 117), // Seadra
};

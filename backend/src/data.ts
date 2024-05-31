import { PokemonModel } from "../../types/pokemon.model";
import { GENERATION } from "../../types/user.types";
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
  "1": POKEMON_LIST.find((p) => p.id === 53), // Persian 2.3968253968253967
  "2": POKEMON_LIST.find((p) => p.id === 30), // Nidorina 2.3679245283018866
  "3": POKEMON_LIST.find((p) => p.id === 159), // Croconaw 2.4585987261146496
  "4": POKEMON_LIST.find((p) => p.id === 159), // Croconaw 2.8497109826589595
  "5": POKEMON_LIST.find((p) => p.id === 159), // Croconaw 3.489247311827957
  "6": POKEMON_LIST.find((p) => p.id === 516), // Simipour 3.6598984771573604
  "7": POKEMON_LIST.find((p) => p.id === 516), // Simipour 3.8523809523809525
  "8": POKEMON_LIST.find((p) => p.id === 516), // Simipour 4.113636363636363
  "9": POKEMON_LIST.find((p) => p.id === 516), // Simipour 4.535398230088496
};

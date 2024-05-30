import { PokedleCustomGuess } from "../../../types/pokemon.model";

export type GENERATION = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export interface PUser {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  stats?: PStats;
  customPokemonGuesses?: PokedleCustomGuess;
  numberOfBestGuesses?: number;
}

export interface PStats {
  dayStreak?: number;
  totalGames: number;
  totalGuesses: number;
  lastGameDate: string; // YYYY-MM-DD
}

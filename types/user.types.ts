import { PokemonModel } from "./pokemon.model";

export type GENERATION = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export interface PUser {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  stats?: PStats;
  customPokemonGuess?: PokemonModel;
  numberOfBestGuesses?: number;
  paymentHistory?: PaymentRecord[];
}

export interface PStats {
  dayStreak?: number;
  totalGames: number;
  totalGuesses: number;
  lastGameDate: string; // YYYY-MM-DD
}

export interface PaymentRecord {
  /** @description stripe checkout session id */
  id: string;
  amount: number;
  product: string;
  date: string;
}

export interface CheckoutItem {
  id: string;
  description: string;
  total: number;
  quantity: number;
  price: number;
  date: string;
}

export interface UserDailyGuessInfo {
  timestamp: number;
  order: number;
  photoURL: string;
  displayName: string;
}

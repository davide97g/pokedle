import { PokemonSummary } from "./pokemon.model";
import { PokedleUser } from "./user.model";

export type DailyUserStats = {
  userId: string;
  date: string;
  pokemonId: number;
  guesses: number;
};

export type DailyUserStatsResponse = Omit<DailyUserStats, "pokemonId"> & {
  pokemon: PokemonSummary;
};

export type PublicLeaderboardItem = {
  user: PokedleUser;
  bestStreak: number;
  currentStreak: number;
  totalGuesses: number;
  totalGames: number;
};

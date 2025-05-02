import { PokemonSummary } from "./pokemon.model";

export type DailyUserStats = {
  userId: string;
  date: string;
  pokemonId: number;
  guesses: number;
};

export type DailyUserStatsResponse = Omit<DailyUserStats, "pokemonId"> & {
  pokemon: PokemonSummary;
};

import { getDatabase } from "../config/database";
import { generationLimits } from "../constants";

export function searchPokemon(query?: string, gen?: number) {
  const limit = generationLimits[gen ? gen - 1 : 0];
  const database = getDatabase(gen ?? 1);
  if (!query) {
    return database.slice(0, 10);
  }
  return (
    database
      .filter(
        (pokemon) =>
          pokemon.id <= limit &&
          pokemon.name.toLowerCase().includes(query.toLowerCase())
      )
      // limit to 10 results
      .slice(0, 10)
      .sort((a, b) => a.id - b.id)
  );
}

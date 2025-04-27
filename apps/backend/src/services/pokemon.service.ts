import { getDatabase } from "../config/database";

export function searchPokemon(query: string) {
  const database = getDatabase();
  return (
    database
      .filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      )
      // limit to 10 results
      .slice(0, 10)
      .sort((a, b) => a.id - b.id)
  );
}

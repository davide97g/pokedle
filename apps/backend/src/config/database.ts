import { PokemonModel } from "@pokedle/types";

const databasePath = process.env.DATABASE_PATH || "../data/pokemon.json";
let database: PokemonModel[] = [];

export function getDatabase(gen: number): PokemonModel[] {
  if (database.length === 0) {
    const data = require(databasePath);
    if (!data) {
      throw new Error("Database not found");
    }
    database = data as PokemonModel[];
    if (!Array.isArray(database)) {
      throw new Error("Database is not an array");
    }
  }
  return database.filter((p) => p.generation <= gen);
}

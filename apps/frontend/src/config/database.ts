import { PokemonModel } from "@pokedle/types";

let database: PokemonModel[] = [];
export const getDatabase = async () => {
  if (database.length > 0) return database;
  const currentOriginal = window.location.origin;
  const response = await fetch(`${currentOriginal}/data.json`);
  const data = await response.json();

  database = data as PokemonModel[];
  return database;
};

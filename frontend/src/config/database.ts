import { PokemonModel } from "../../../types/pokemon.model";

let database: PokemonModel[] = [];
export const getDatabase = async () => {
  if (database.length > 0) return database;
  const currentOriginal = window.location.origin;
  const response = await fetch(`${currentOriginal}/data.json`);
  const data = await response.json();
  console.log("data", data);
  database = data as PokemonModel[];
  return database;
};

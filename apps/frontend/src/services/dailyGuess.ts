function getPokemonToGuess() {
  return Math.floor(Math.random() * 151) + 1;
}

const savedPokemonId = window.localStorage.getItem("pokemonToGuess");
const pokemonToGuess = savedPokemonId
  ? parseInt(savedPokemonId)
  : updatePokemonToGuess();

export function updatePokemonToGuess() {
  const newPokemonId = getPokemonToGuess();
  window.localStorage.setItem("pokemonToGuess", newPokemonId.toString());
}

export const POKEMON_TO_GUESS_ID = pokemonToGuess;

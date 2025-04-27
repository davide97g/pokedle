import dayjs from "dayjs";

function retrieveRemoteHiddenPokemonForDay(day: string) {
  return 1;
}

let hiddenPokemonId = 0;
const day = dayjs().format("YYYY-MM-DD");

export function getPokemonIdToGuess() {
  if (!hiddenPokemonId) {
    const hiddenPokemon = retrieveRemoteHiddenPokemonForDay(day);
  }
  return 1;
}

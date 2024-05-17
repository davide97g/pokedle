const getRandomPokemonId = (previousId?: number) => {
  const randomId = Math.floor(Math.random() * 151) + 1;
  if (randomId === previousId) {
    return getRandomPokemonId(previousId);
  }
  return randomId;
};

let POKEMON_ID_TO_SOLVE = getRandomPokemonId();

const getNewPokemonIdToSolve = () => {
  POKEMON_ID_TO_SOLVE = getRandomPokemonId();
  return POKEMON_ID_TO_SOLVE;
};

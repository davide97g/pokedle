// for each pokemon from id 1 to 151 add a new json related to enhanced data (color, evolution stage, habitat)

import axios from "axios";
import { writeFileSync } from "fs";
import { join } from "path";

const NUMBER_EVOLUTION_CHAINS = 549;
const NUMBER_OF_POKEMON = 1025;
// const NUMBER_OF_POKEMON = 1025;
// const NUMBER_EVOLUTION_CHAINS = 549;

const getPokemonFromEvolutionChain = async (evolutionChainId) => {
  const evolutionChain = await axios
    .get(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}`)
    .catch(() => {
      console.log(`No data for evolution chain ${evolutionChainId}`);
    });
  if (!evolutionChain) return;
  const { data } = evolutionChain;
  const pokemonEvolutions = [];
  const getPokemon = (chain, stage) => {
    const id = chain.species.url.split("/")[6];
    if (id <= NUMBER_OF_POKEMON && chain.species)
      pokemonEvolutions.push({
        id: Number(id),
        name: chain.species.name,
        stage,
      });

    if (chain.evolves_to) {
      chain.evolves_to.forEach((evolution) => {
        getPokemon(evolution, id <= NUMBER_OF_POKEMON ? stage + 1 : stage);
      });
    }
  };
  getPokemon(data.chain, 1);
  return pokemonEvolutions;
};

const gatherEvolutionChainInfo = async () => {
  const promises = [];
  for (let i = 1; i <= NUMBER_EVOLUTION_CHAINS; i++)
    promises.push(getPokemonFromEvolutionChain(i));

  const pokemonEvolutions = await Promise.all(promises);
  return pokemonEvolutions.flat();
};

const evolutionData = async () => {
  const pokemonEvolutionData = await gatherEvolutionChainInfo();
  const filePath = join("./data/", `evolution-data.json`);
  writeFileSync(filePath, JSON.stringify(pokemonEvolutionData.filter(Boolean)));
};

evolutionData();

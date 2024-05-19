// for each pokemon from id 1 to 151 add a new json related to enhanced data (color, evolution stage, habitat)

import axios from "axios";
import { writeFileSync } from "fs";
import { join } from "path";

const getPokemonFromEvolutionChain = async (evolutionChainId) => {
  const evolutionChain = await axios.get(
    `https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}`
  );
  const { data } = evolutionChain;
  const pokemonEvolutions = [];
  const getPokemon = (chain, stage) => {
    const id = chain.species.url.split("/")[6];
    if (id <= 151 && chain.species)
      pokemonEvolutions.push({
        id: Number(id),
        name: chain.species.name,
        stage,
      });

    if (chain.evolves_to) {
      chain.evolves_to.forEach((evolution) => {
        getPokemon(evolution, id <= 151 ? stage + 1 : stage);
      });
    }
  };
  getPokemon(data.chain, 1);
  return pokemonEvolutions;
};

const gatherEvolutionChainInfo = async () => {
  const promises = [];
  for (let i = 1; i <= 78; i++) promises.push(getPokemonFromEvolutionChain(i));

  const pokemonEvolutions = await Promise.all(promises);
  return pokemonEvolutions.flat();
};

const enhancer = async () => {
  const pokeData = [];
  const pokemonEvolutionData = await gatherEvolutionChainInfo();
  for (let i = 1; i <= 151; i++) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const { data } = response;
    const speciesResponse = await axios.get(data.species.url);
    const { data: speciesData } = speciesResponse;
    const color = speciesData.color.name;
    const evolutionStage = pokemonEvolutionData.find(
      (poke) => poke.id === i
    ).stage;
    const habitat = speciesData.habitat ? speciesData.habitat.name : "unknown";
    const enhancedData = { id: data.id, color, evolutionStage, habitat };
    pokeData.push(enhancedData);
    const filePath = join("./data/", `pokemon-enhanced-${i}.json`);
    writeFileSync(filePath, JSON.stringify(enhancedData));
  }
  const filePath = join("./data/", "pokemon-enhanced.json");
  writeFileSync(filePath, JSON.stringify(pokeData));
};

enhancer();

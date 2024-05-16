// for each pokemon from id 1 to 151 add a new json related to enhanced data (color, evolution stage, habitat)

import axios from "axios";
import { writeFileSync } from "fs";
import { join } from "path";

const enhancer = async () => {
  const pokeData = [];
  for (let i = 1; i <= 151; i++) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const { data } = response;
    const speciesResponse = await axios.get(data.species.url);
    const { data: speciesData } = speciesResponse;
    const color = speciesData.color.name;
    const evolutionChainResponse = await axios.get(
      speciesData.evolution_chain.url
    );
    const { data: evolutionChainData } = evolutionChainResponse;
    const evolutionStage = evolutionChainData.chain.evolves_to.length; // TODO: this is not correct
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

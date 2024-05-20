// for each pokemon from id 1 to 151 add a new json related to enhanced data (color, evolution stage, habitat)

import axios from "axios";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const NUMBER_OF_POKEMON = 1025;

const enhancer = async () => {
  const pokeData = [];

  const evolutionData = JSON.parse(
    readFileSync(join("./data/", `evolution-data.json`), "utf8")
  );

  const pokemonEvolutionData = evolutionData.filter(Boolean);

  for (let i = 1; i <= NUMBER_OF_POKEMON; i++) {
    // if the file already exists, skip it
    const checkFilePath = join("./data/enhanced", `pokemon-enhanced-${i}.json`);
    if (existsSync(checkFilePath, "utf8")) continue;

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const { data } = response;
    const speciesResponse = await axios.get(data.species.url);
    const { data: speciesData } = speciesResponse;
    const color = speciesData.color.name;
    const evolutionStage =
      pokemonEvolutionData.find((poke) => poke.id === i)?.stage ?? 1;
    const habitat = speciesData.habitat ? speciesData.habitat.name : "unknown";
    const enhancedData = { id: data.id, color, evolutionStage, habitat };
    pokeData.push(enhancedData);
    const filePath = join("./data/enhanced/", `pokemon-enhanced-${i}.json`);
    writeFileSync(filePath, JSON.stringify(enhancedData));
  }
};

enhancer();

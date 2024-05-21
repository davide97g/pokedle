// for each pokemon from id 1 to 151 add a new json related to enhanced data (color, evolution stage, habitat)

import axios from "axios";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import cliProgress from "cli-progress";

// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const NUMBER_OF_POKEMON = 1025;

const enhancer = async () => {
  const evolutionData = JSON.parse(
    readFileSync(join("./data/", `evolution-data.json`), "utf8")
  );

  const pokemonEvolutionData = evolutionData.filter(Boolean);

  bar1.start(NUMBER_OF_POKEMON, 0);

  for (let i = 1; i <= NUMBER_OF_POKEMON; i++) {
    // console.log(`Enhancing Pokemon ${i}...`);
    // if the file already exists, skip it
    // const checkFilePath = join("./data/enhanced", `pokemon-enhanced-${i}.json`);
    // if (existsSync(checkFilePath, "utf8")) continue;

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const { data } = response;
    const speciesResponse = await axios.get(data.species.url);
    const { data: speciesData } = speciesResponse;
    const color = speciesData.color.name;
    const evolutionStage =
      pokemonEvolutionData.find((poke) => poke.id === i)?.stage ?? 1;
    const habitat = speciesData.habitat ? speciesData.habitat.name : "unknown";
    const generation = Number(speciesData.generation.url.split("/")[6]);
    const enhancedData = {
      id: data.id,
      color,
      evolutionStage,
      habitat,
      generation,
    };
    const filePath = join("./data/enhanced/", `pokemon-enhanced-${i}.json`);
    writeFileSync(filePath, JSON.stringify(enhancedData));
    bar1.update(i);
  }
  bar1.stop();
};

enhancer();

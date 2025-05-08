//  DOWNLOAD THE FIRST 151 POKEMON FROM THE POKEAPI
import axios from "axios";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

// const NUMBER_OF_POKEMON = 151;
const NUMBER_OF_POKEMON = 1025;

const scraper = async () => {
  // create a directory for the data
  const dir = "./data/basic/";
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  //    save each pokemon also as a separate file
  for (let i = 1; i <= NUMBER_OF_POKEMON; i++) {
    // if the file already exists, skip it
    const checkFilePath = join("./data/basic", `pokemon-${i}.json`);
    if (existsSync(checkFilePath)) continue;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const { data } = response;
    const pokemon = {
      id: data.id,
      name: data.name,
      types: data.types,
      height: data.height,
      weight: data.weight,
      image: data.sprites.front_default,
    };
    const filePath = join("./data/basic", `pokemon-${i}.json`);
    writeFileSync(filePath, JSON.stringify(pokemon));
  }
};

scraper();

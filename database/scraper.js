//  DOWNLOAD THE FIRST 151 POKEMON FROM THE POKEAPI
import axios from "axios";
import { writeFileSync } from "fs";
import { join } from "path";

const scraper = async () => {
  const pokeData = [];
  //    save each pokemon also as a separate file
  for (let i = 1; i <= 151; i++) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const { data } = response;
    pokeData.push(data);
    const filePath = join("./data/", `pokemon-${i}.json`);
    writeFileSync(filePath, JSON.stringify(data));
  }
  const filePath = join("./data/", "pokemon.json");
  writeFileSync(filePath, JSON.stringify(pokeData));
};

scraper();

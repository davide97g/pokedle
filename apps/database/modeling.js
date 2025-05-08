// take the pokemon data from the database and create a model for it
// this model will be used to create the pokemon object
// the pokemon object will have the following properties:
// - id
// - name
// - type1
// - type2
// - height
// - weight
// - image
// - color
// - evolutionStage
// - habitat
//

// write the file as a unique json array of objects

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const NUMBER_OF_POKEMON = 151;

const modeling = () => {
  const pokemonData = [];
  for (let i = 1; i <= NUMBER_OF_POKEMON; i++) {
    const filePath = join("./data/basic/", `pokemon-${i}.json`);
    const filePathEnhanced = join(
      "./data/enhanced/",
      `pokemon-enhanced-${i}.json`
    );

    // if the file does not exist, skip it
    if (!existsSync(filePath) || !existsSync(filePathEnhanced)) continue;

    const data = readFileSync(filePath, "utf8");
    const pokemon = JSON.parse(data);

    const dataEnhanced = readFileSync(filePathEnhanced, "utf8");
    const enhancedData = JSON.parse(dataEnhanced);

    pokemonData.push({
      ...enhancedData,
      name: pokemon.name,
      type1: pokemon.types[0].type.name,
      type2: pokemon.types[1] ? pokemon.types[1].type.name : "none",
      height: pokemon.height,
      weight: pokemon.weight,
      image: pokemon.image,
    });
  }
  const filePath = join("./data/", "pokemon-model.json");
  writeFileSync(filePath, JSON.stringify(pokemonData));
};

modeling();

import dayjs from "dayjs";
import { getFirestore } from "firebase-admin/firestore";
import { PokedleDayStats, PokemonModel } from "../../../../types/pokemon.model";
import { GENERATION, getPokemonList } from "../../data";

export let DAILY_POKEMONS: PokedleDayStats | null = null;

export const updatePokemonToGuess = async () => {
  const db = getFirestore();
  const pokemonCollection = db.collection("pokemon");
  const today = dayjs().format("YYYY-MM-DD");
  const pokemonsRef = pokemonCollection.doc(today);
  const yesterdayPokemonsRef = pokemonCollection.doc(
    dayjs().subtract(1, "day").format("YYYY-MM-DD")
  );

  const yesterdayPokemons = await yesterdayPokemonsRef.get().then((doc) => {
    if (doc.exists) {
      return doc.data() as PokedleDayStats;
    }
    return null;
  });

  const getRandomPokemon = (
    gen: GENERATION,
    alreadyUsedIdList: number[]
  ): PokemonModel => {
    const pokemonList = getPokemonList(gen ?? "1");
    const filterdList = pokemonList.filter(
      (pokemon) => !alreadyUsedIdList.includes(pokemon.id)
    );
    const randomId = Math.floor(Math.random() * filterdList.length) + 1;
    return filterdList[randomId];
  };

  const generationList: GENERATION[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  const randomPokemonList: { gen: GENERATION; pokemon: PokemonModel }[] =
    generationList.map((gen) => {
      // const alreadyUsedIdList = yesterdayPokemons?.pokemonList
      //   .filter((p) => p.gen === gen)
      //   .map((p) => p.pokemon.id) as number[];
      return {
        gen,
        pokemon: getRandomPokemon(gen, []),
      };
    });

  const todayPokemonList: PokedleDayStats = {
    pokemonList: randomPokemonList,
    date: today,
    totalGuesses: 0,
  };

  DAILY_POKEMONS = todayPokemonList;

  // save today's pokemon list
  await pokemonsRef.set(todayPokemonList);

  return todayPokemonList;
};

export const getTodayPokemonList = async () => {
  const today = dayjs().format("YYYY-MM-DD");

  if (DAILY_POKEMONS && DAILY_POKEMONS.date === today) {
    return DAILY_POKEMONS;
  }

  const db = getFirestore();
  const pokemonCollection = db.collection("pokemon");
  const pokemonsRef = pokemonCollection.doc(today);

  const todayPokemons = await pokemonsRef.get().then((doc) => {
    if (doc.exists) {
      return doc.data() as PokedleDayStats;
    }
    return null;
  });

  DAILY_POKEMONS = todayPokemons;

  return todayPokemons;
};

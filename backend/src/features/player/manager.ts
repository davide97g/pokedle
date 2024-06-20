import dayjs from "dayjs";
import { getFirestore } from "firebase-admin/firestore";
import { PokedleDayStats, PokemonModel } from "../../../../types/pokemon.model";
import { GENERATION, PUser } from "../../../../types/user.types";
import { getPokemonList } from "../../data";
import { resetCounter } from "../counter";

export const DayStats: PokedleDayStats = {
  pokemonList: [],
  date: dayjs().format("YYYY-MM-DD"),
  totalGuesses: 0,
};

export const PersonalPokemonGuesses: {
  [userId: string]: PokemonModel;
} = {};

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
  const randomPokemonList: {
    gen: GENERATION;
    pokemon: PokemonModel;
    sid: string;
  }[] = generationList.map((gen) => {
    const yesterdayPokemon = yesterdayPokemons?.pokemonList.find(
      (p) => p.gen === gen
    );
    return {
      gen,
      pokemon: getRandomPokemon(
        gen,
        yesterdayPokemon?.pokemon.id ? [yesterdayPokemon?.pokemon.id] : []
      ),
      sid: crypto.randomUUID(), // ? this is useful for understanding wether the pokemon has changed or not
    };
  });

  DayStats.pokemonList = randomPokemonList;
  DayStats.date = today;
  DayStats.totalGuesses = 0;

  // save today's pokemon list
  await pokemonsRef.set(DayStats);
  await resetCounter();

  return DayStats;
};

export const getTodayPokemonList = async () => {
  const today = dayjs().format("YYYY-MM-DD");

  if (DayStats.pokemonList.length > 0 && DayStats.date === today)
    return DayStats;

  const db = getFirestore();
  const pokemonCollection = db.collection("pokemon");
  const pokemonsRef = pokemonCollection.doc(today);

  const todayPokemons = await pokemonsRef.get().then((doc) => {
    if (doc.exists) return doc.data() as PokedleDayStats;
    return null;
  });

  if (todayPokemons) {
    DayStats.date = todayPokemons?.date;
    DayStats.totalGuesses = todayPokemons?.totalGuesses;
    DayStats.pokemonList = todayPokemons?.pokemonList;
    return todayPokemons;
  }

  if (!todayPokemons) {
    const updated = await updatePokemonToGuess();
    DayStats.date = updated.date;
    DayStats.totalGuesses = updated.totalGuesses;
    DayStats.pokemonList = updated.pokemonList;
    return updated;
  }
};

export const getCurrentStatsID = (gen: GENERATION) => {
  return DayStats.pokemonList.find((p) => p.gen === gen)?.sid;
};

export const updatePersonalPokemonToGuess = async (userId: string) => {
  const db = getFirestore();
  const userRef = db.doc(`users/${userId}`);

  const pokemonGuess = getRandomPokemon("1", []);
  PersonalPokemonGuesses[userId] = pokemonGuess;
  await userRef.set(pokemonGuess);

  return PersonalPokemonGuesses[userId];
};

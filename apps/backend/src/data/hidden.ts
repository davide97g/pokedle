import dayjs from "dayjs";
import { getFirestoreDatabase } from "../config/firebase";
import { generationLimits } from "../constants";

let hiddenPokemonIds: GenerationRecord[] = [];

const day = dayjs().format("YYYY-MM-DD");

type GenerationRecord = {
  gen: number;
  id: number;
};

async function retrieveRemoteHiddenPokemonForDay(day: string) {
  const db = getFirestoreDatabase();
  const docRef = db.collection("guesses").doc(day);
  const data = (await docRef.get()).data() as
    | { randomIdList: GenerationRecord[] }
    | undefined;
  if (!data) {
    const randomIdList = generationLimits.map((limit, index) => ({
      gen: index + 1,
      id: Math.floor(Math.random() * limit) + 1,
    }));
    await db.collection("guesses").doc(day).set({ randomIdList });
    return randomIdList;
  }
  return data.randomIdList;
}

export async function getPokemonIdToGuess(gen: number) {
  if (!hiddenPokemonIds.length)
    hiddenPokemonIds = await retrieveRemoteHiddenPokemonForDay(day);

  if (!hiddenPokemonIds.length) throw new Error("Hidden Pokemons not found");

  const dailyHiddenPokemonId = hiddenPokemonIds.find(
    (item) => item.gen === gen
  )?.id;
  if (!dailyHiddenPokemonId)
    throw new Error("Daily hidden Pokemon ID not found");

  return dailyHiddenPokemonId;
}

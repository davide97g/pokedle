import dayjs from "dayjs";
import { getFirestoreDatabase } from "../config/firebase";
import { generationLimits } from "../constants";

let hiddenPokemonId = 0;
const day = dayjs().format("YYYY-MM-DD");

type GenerationRecord = {
  gen: number;
  id: number;
};

async function retrieveRemoteHiddenPokemonForDay(day: string, gen: number = 1) {
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
    return randomIdList.find((item) => item.gen === gen)?.id;
  }
  const dailyHiddenPokemonId = data.randomIdList.find(
    (item) => item.gen === gen
  )?.id;
  if (!dailyHiddenPokemonId) {
    throw new Error("Hidden Pokemon ID not found");
  }
  if (typeof dailyHiddenPokemonId !== "number") {
    throw new Error("Hidden Pokemon ID is not a number");
  }
  if (dailyHiddenPokemonId < 1) {
    throw new Error("Hidden Pokemon ID is less than 1");
  }
  if (dailyHiddenPokemonId > 1025) {
    throw new Error("Hidden Pokemon ID is greater than 1025");
  }
  if (dailyHiddenPokemonId % 1 !== 0) {
    throw new Error("Hidden Pokemon ID is not an integer");
  }
  if (dailyHiddenPokemonId === 0) {
    throw new Error("Hidden Pokemon ID is 0");
  }
  return dailyHiddenPokemonId;
}

export async function getPokemonIdToGuess(gen: number) {
  if (!hiddenPokemonId) {
    const newHiddenPokemonId = await retrieveRemoteHiddenPokemonForDay(
      day,
      gen
    );
    if (!newHiddenPokemonId) {
      throw new Error("Hidden Pokemon not found");
    }
    hiddenPokemonId = newHiddenPokemonId;
  }
  return hiddenPokemonId;
}

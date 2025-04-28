import dayjs from "dayjs";
import { getFirestoreDatabase } from "../config/firebase";

let hiddenPokemonId = 0;
const day = dayjs().format("YYYY-MM-DD");

async function retrieveRemoteHiddenPokemonForDay(day: string) {
  const db = getFirestoreDatabase();
  const docRef = db.collection("guesses").doc(day);
  const data = (await docRef.get()).data();
  if (!data) {
    const randomId = Math.floor(Math.random() * 151) + 1;
    await db.collection("guesses").doc(day).set({
      hiddenPokemonId: randomId,
    });
    return randomId;
  }
  const dailyHiddenPokemonId = data.hiddenPokemonId;
  if (!dailyHiddenPokemonId) {
    throw new Error("Hidden Pokemon ID not found");
  }
  if (typeof dailyHiddenPokemonId !== "number") {
    throw new Error("Hidden Pokemon ID is not a number");
  }
  if (dailyHiddenPokemonId < 1) {
    throw new Error("Hidden Pokemon ID is less than 1");
  }
  if (dailyHiddenPokemonId > 151) {
    throw new Error("Hidden Pokemon ID is greater than 151");
  }
  if (dailyHiddenPokemonId % 1 !== 0) {
    throw new Error("Hidden Pokemon ID is not an integer");
  }
  if (dailyHiddenPokemonId === 0) {
    throw new Error("Hidden Pokemon ID is 0");
  }
  return dailyHiddenPokemonId;
}

export async function getPokemonIdToGuess() {
  if (!hiddenPokemonId) {
    const newHiddenPokemonId = await retrieveRemoteHiddenPokemonForDay(day);
    if (!newHiddenPokemonId) {
      throw new Error("Hidden Pokemon not found");
    }
    hiddenPokemonId = newHiddenPokemonId;
  }
  return hiddenPokemonId;
}

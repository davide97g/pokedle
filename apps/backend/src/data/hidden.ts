import dayjs from "dayjs";
import { getFirestoreDatabase } from "../config/firebase";

async function retrieveRemoteHiddenPokemonForDay(day: string) {
  const db = getFirestoreDatabase();
  const docRef = db.collection("guesses").doc(day);
  if (!docRef) {
    throw new Error("Document not found");
  }
  const doc = docRef.get();
  if (!doc) {
    throw new Error("Document not found");
  }
  const data = (await doc).data();
  if (!data) {
    throw new Error("Data not found");
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

let hiddenPokemonId = 0;
const day = dayjs().format("YYYY-MM-DD");

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

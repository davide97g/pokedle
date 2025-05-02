import { DailyUserStats, DailyUserStatsResponse } from "@pokedle/types";
import { getDatabase } from "../config/database";
import { getFirestoreDatabase } from "../config/firebase";

export async function addWinningForUser(record: DailyUserStats) {
  const firestore = getFirestoreDatabase();
  const userStatsRef = firestore
    .collection("users")
    .doc(record.userId)
    .collection("stats")
    .doc(record.date);
  if (!record.guesses || !record.pokemonId) {
    throw new Error("Invalid record: guesses and pokemonId are required");
  }

  // Check if the document already exists
  return userStatsRef.get().then((doc) => {
    if (doc.exists) {
      console.error("Document already exists");
    } else {
      userStatsRef.set(
        {
          guesses: record.guesses,
          pokemonId: record.pokemonId,
        },
        { merge: true }
      );
    }
  });
}

export async function getUserStats(userId: string) {
  const pokemonList = getDatabase();
  const firestore = getFirestoreDatabase();
  const userStatsRef = firestore
    .collection("users")
    .doc(userId)
    .collection("stats");
  return userStatsRef.get().then((snapshot) => {
    if (snapshot.empty) {
      return [];
    }
    const stats: DailyUserStatsResponse[] = [];
    snapshot.forEach((doc) => {
      const pokemon = pokemonList.find((p) => p.id === doc.data().pokemonId);
      if (!pokemon) {
        console.error("Pokemon not found");
        return;
      }
      stats.push({
        date: doc.id,
        ...doc.data(),
        pokemon: {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
          color: pokemon.color,
        },
      } as DailyUserStatsResponse);
    });
    return stats;
  });
}

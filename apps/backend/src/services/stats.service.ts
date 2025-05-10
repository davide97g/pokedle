import {
  DailyUserStats,
  DailyUserStatsResponse,
  PublicLeaderboardItem,
} from "@pokedle/types";
import { getDatabase } from "../config/database";
import { getFirestoreDatabase } from "../config/firebase";

export async function addWinningForUser(
  record: DailyUserStats,
  user: {
    id: string;
    name: string;
    image?: string;
  }
) {
  const firestore = getFirestoreDatabase();
  const userStatsRef = firestore
    .collection("usersStats")
    .doc(record.userId)
    .collection("games")
    .doc(record.date);
  if (!record.guesses || !record.pokemonId) {
    throw new Error("Invalid record: guesses and pokemonId are required");
  }

  // Check if the document already exists
  const alreadyGuessesToday = await userStatsRef.get().then((doc) => {
    if (doc.exists) {
      console.error("Document already exists");
      return true;
    } else {
      userStatsRef.set(
        {
          guesses: record.guesses,
          pokemonId: record.pokemonId,
          date: record.date,
        },
        { merge: true }
      );
      return false;
    }
  });

  if (alreadyGuessesToday) return;

  // Check if also yestarday's record exists
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayRecordRef = firestore
    .collection("usersStats")
    .doc(record.userId)
    .collection("games")
    .doc(yesterday.toISOString().split("T")[0]);
  const addToStreak = await yesterdayRecordRef.get().then((doc) => doc.exists);

  // Update the global public leaderboard
  const userLearderboardRef = firestore
    .collection("leaderboard")
    .doc(record.userId);
  return userLearderboardRef.get().then((doc) => {
    // Check if the document already exists
    if (doc.exists) {
      const data = doc.data();
      if (data) {
        const item = data as PublicLeaderboardItem;
        item.currentStreak = addToStreak ? item.currentStreak + 1 : 1;
        item.totalGames += 1;
        item.totalGuesses += record.guesses;
        item.bestStreak = Math.max(item.currentStreak, item.bestStreak);
        userLearderboardRef.set(item, { merge: true });
      }
    } else {
      userLearderboardRef.set({
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        currentStreak: 1,
        totalGames: 1,
        totalGuesses: record.guesses,
        bestStreak: 1,
      } as PublicLeaderboardItem);
    }
  });
}

export async function getUserStats(userId: string) {
  const pokemonList = getDatabase(9);
  const firestore = getFirestoreDatabase();
  const userStatsRef = firestore
    .collection("usersStats")
    .doc(userId)
    .collection("games");
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

export async function getPublicLeaderboard(
  page: number,
  pageSize: number,
  sortBy: string,
  sortOrder: "asc" | "desc"
) {
  const firestore = getFirestoreDatabase();
  const userStatsRef = firestore.collection("leaderboard");
  return userStatsRef
    .orderBy(sortBy, sortOrder)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return [];
      }
      const leaderboard: PublicLeaderboardItem[] = [];
      snapshot.forEach((doc) => {
        leaderboard.push(doc.data() as PublicLeaderboardItem);
      });
      return leaderboard;
    });
}

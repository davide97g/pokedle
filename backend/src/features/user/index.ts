import dayjs from "dayjs";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

export const updateUserStats = async ({
  userId,
  totalGuesses,
}: {
  userId: string;
  totalGuesses: number;
}): Promise<void> => {
  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  const user = userDoc.data();
  if (!user) {
    throw new Error("User data is empty");
  }

  const previousDate = user.stats.lastGameDate;
  const dayStreak =
    dayjs().diff(dayjs(previousDate), "day") === 1
      ? (user.stats.dayStreak ?? 0) + 1
      : 1;

  await userRef.update({
    stats: {
      totalGuesses: (user.stats.totalGuesses ?? 0) + totalGuesses,
      totalGames: (user.stats.totalGames ?? 0) + 1,
      dayStreak,
      lastGameDate: dayjs().format("YYYY-MM-DD"),
    },
  });
};

export const decrementUserBestGuesses = async ({
  userId,
}: {
  userId: string;
}): Promise<void> => {
  if (!userId) throw new Error("User not found");

  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);

  userRef.update({
    numberOfBestGuesses: FieldValue.increment(-1),
  });
};

export const incrementUserBestGuess = async ({
  userId,
  quantity,
}: {
  userId: string;
  quantity: number;
}): Promise<void> => {
  if (!userId) throw new Error("User not found");

  const db = getFirestore();
  const userRef = db.collection("users").doc(userId);

  userRef.update({
    numberOfBestGuesses: FieldValue.increment(quantity),
  });
};

import dayjs from "dayjs";
import { getDatabase } from "firebase-admin/database";

export const incrementCounter = async (userId?: string) => {
  const rtdb = getDatabase();
  const refCounter = rtdb.ref("counter");
  const snap = await refCounter.get();
  const counter = snap.val();
  const newCounter = (counter ?? 0) + 1;
  await refCounter.set(newCounter);
  if (userId) {
    const refUsers = rtdb.ref(`users/${userId}`);
    await refUsers.set({
      timestampGuess: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      order: newCounter,
    });
  }
};

export const resetCounter = async () => {
  const rtdb = getDatabase();
  const refCounter = rtdb.ref("counter");
  const refUsers = rtdb.ref("users");
  await refCounter.set(0);
  await refUsers.set([]);
};

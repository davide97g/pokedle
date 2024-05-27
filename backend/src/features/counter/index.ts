import { getDatabase } from "firebase-admin/database";

export const incrementCounter = async (): Promise<number> => {
  const rtdb = getDatabase();
  const ref = rtdb.ref("counter");
  const snap = await ref.get();
  const counter = snap.val();
  await ref.set((counter ?? 0) + 1);
  return counter + 1;
};

export const resetCounter = async (): Promise<number> => {
  const rtdb = getDatabase();
  const ref = rtdb.ref("counter");
  await ref.set(0);
  return 0;
};

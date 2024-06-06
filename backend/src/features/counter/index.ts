import dayjs from "dayjs";
import { getDatabase } from "firebase-admin/database";
import { UserDailyGuessInfo } from "../../../../types/user.types";

export const incrementCounter = async ({
  user,
}: {
  user?: {
    uid: string;
    displayName: string;
    photoURL: string;
  };
}) => {
  const rtdb = getDatabase();
  const refCounter = rtdb.ref("counter");
  const snap = await refCounter.get();
  const counter = snap.val();
  const newCounter = (counter ?? 0) + 1;
  await refCounter.set(newCounter);
  if (user?.uid) {
    const refUser = rtdb.ref(`users/${user.uid}`);
    const userDailyGuessInfo: UserDailyGuessInfo = {
      timestamp: dayjs().unix(),
      order: newCounter,
      photoURL: user.photoURL,
      displayName: user.displayName,
    };
    await refUser.set(userDailyGuessInfo);
  }
};

export const resetCounter = async () => {
  const rtdb = getDatabase();
  const refCounter = rtdb.ref("counter");
  const refUser = rtdb.ref("users");
  await refCounter.set(0);
  await refUser.set({});
};

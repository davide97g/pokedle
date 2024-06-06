import { onValue, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import { UserDailyGuessInfo } from "../../../../types/user.types";
import { rtdb } from "../../config/firebase";

export const useDailyUserStats = () => {
  const [usersDailyGuessInfo, setUsersDailyGuessInfo] = useState<
    {
      uid: string;
      dailyGuessInfo: UserDailyGuessInfo;
    }[]
  >([]);

  const usersInfoRef = useMemo(() => ref(rtdb, `users`), []);

  useEffect(() => {
    onValue(usersInfoRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const values = data as { [key: string]: UserDailyGuessInfo };
      setUsersDailyGuessInfo(
        Object.keys(values).map((uid) => ({
          uid,
          dailyGuessInfo: values[uid],
        }))
      );
    });
  }, [usersInfoRef]);

  return { usersDailyGuessInfo };
};

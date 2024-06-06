import { onValue, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import { rtdb } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import { UserDailyGuessInfo } from "../../../types/user.types";

export const Counter = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [userDailyGuessInfo, setUserDailyGuessInfo] =
    useState<UserDailyGuessInfo>();
  const starCountRef = useMemo(() => ref(rtdb, "counter"), []);
  const userInfoRef = useMemo(() => ref(rtdb, `users/${user?.id}`), [user?.id]);

  useEffect(() => {
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setCount(Number(data ?? 0));
    });
  }, [starCountRef]);

  useEffect(() => {
    if (!user?.id) return;
    onValue(userInfoRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      setUserDailyGuessInfo(data as UserDailyGuessInfo);
    });
  }, [userInfoRef, user?.id]);

  return !userDailyGuessInfo ? (
    <p className="text-xs">{count} have already find out</p>
  ) : (
    <p className="text-xs text-white/50 flex justify-end mr-2">
      🎉 Congratulations! You guessed correctly for today!{" "}
      <span className="font-bold px-1">
        Position: {userDailyGuessInfo?.order}/{count}
      </span>
    </p>
  );
};

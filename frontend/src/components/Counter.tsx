import { onValue, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import { rtdb } from "../config/firebase";

export const Counter = () => {
  const [count, setCount] = useState(0);
  const starCountRef = useMemo(() => ref(rtdb, "counter"), []);

  useEffect(() => {
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setCount(Number(data ?? 0));
    });
  }, [starCountRef]);

  if (!count) return null;
  return <p className="text-xs">{count} have already find out</p>;
};

import { DailyUserStatsResponse } from "@pokedle/types";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

export const useStatsGetUserStats = () => {
  return useQuery({
    queryKey: ["stats", "history"],
    queryFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      return fetch(`${import.meta.env.VITE_BACKEND_URL}/stats/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((res) => res as DailyUserStatsResponse[]);
    },
    enabled: true,
  });
};

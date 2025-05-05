import { ApiPaginatedResponse, PublicLeaderboardItem } from "@pokedle/types";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

export const useStatsGetPublicLeaderboard = (page?: number) => {
  return useQuery({
    queryKey: ["stats", "public", "leaderboard", page],
    queryFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      const pageQuery = page ? `?page=${page}` : "";
      return fetch(`${import.meta.env.VITE_BACKEND_URL}/stats${pageQuery}`, {
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
        .then((res) => res as ApiPaginatedResponse<PublicLeaderboardItem>);
    },
    enabled: true,
  });
};

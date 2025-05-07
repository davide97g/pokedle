import { PokemonModel } from "@pokedle/types";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

export const useGetBestGuessPokemon = ({
  previouslyGuessedPokemonIdList,
}: {
  previouslyGuessedPokemonIdList: number[];
}) => {
  const queryParams = previouslyGuessedPokemonIdList.join("&id=");
  return useQuery({
    queryKey: ["guess", "best", previouslyGuessedPokemonIdList.join(",")],
    queryFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      return fetch(
        `${import.meta.env.VITE_BACKEND_URL}/guess/best${
          queryParams ? `?id=${queryParams}` : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((res) => res as PokemonModel);
    },
    enabled: false,
  });
};

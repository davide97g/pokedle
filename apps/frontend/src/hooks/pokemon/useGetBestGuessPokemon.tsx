import { PokemonModel } from "@pokedle/types";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

export const useGetBestGuessPokemon = ({
  previouslyGuessedPokemonIdList,
  gen,
}: {
  previouslyGuessedPokemonIdList: number[];
  gen: number;
}) => {
  const queryParamsIds = previouslyGuessedPokemonIdList.join("&id=");
  const queryParams = `?gen=${gen}${
    queryParamsIds ? `&id=${queryParamsIds}` : ""
  }`;
  return useQuery({
    queryKey: ["guess", "best", gen, previouslyGuessedPokemonIdList.join(",")],
    queryFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      return fetch(
        `${import.meta.env.VITE_BACKEND_URL}/guess/best${queryParams}`,
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

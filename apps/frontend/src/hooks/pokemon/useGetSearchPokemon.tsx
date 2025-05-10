import { PokemonModel } from "@pokedle/types";
import { useQuery } from "@tanstack/react-query";

export const useGetSearchPokemon = ({
  name,
  gen,
}: {
  name: string;
  gen: number;
}) => {
  return useQuery({
    queryKey: ["pokemon", name, gen],
    queryFn: () =>
      fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/pokemon/search?query=${name}&gen=${gen}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((res) => res as PokemonModel[]),
    enabled: false,
  });
};

import { useQuery } from "@tanstack/react-query";
import { API } from "../../services/api";
import { GENERATION } from "../../../../types/user.types";

export const useGetSearchPokemon = ({
  name,
  gen,
}: {
  name: string;
  gen: GENERATION;
}) => {
  return useQuery({
    queryKey: ["pokemon", gen, name],
    queryFn: () => API.getPokemons({ gen, name }),
    enabled: false,
  });
};

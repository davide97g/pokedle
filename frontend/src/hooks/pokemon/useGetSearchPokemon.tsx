import { useQuery } from "@tanstack/react-query";
import { getDatabase } from "../../config/database";

export const useGetSearchPokemon = ({ name }: { name: string }) => {
  return useQuery({
    queryKey: ["pokemon", name],
    queryFn: () =>
      getDatabase().then((db) =>
        db.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()))
      ),
    enabled: false,
  });
};

import { useQuery } from "@tanstack/react-query";
import { PokemonValidationGuess } from "../../../../types/pokemon.model";
import { GENERATION } from "../../../../types/user.types";
import { API, API_ADMIN } from "../../services/api";
import { useCallback, useMemo } from "react";
import { useAuth } from "../useAuth";

export const useStatusGetStatus = ({
  generation,
  pokemonValidationGuess,
}: {
  generation: GENERATION;
  pokemonValidationGuess: PokemonValidationGuess[];
}) => {
  const { isAdmin } = useAuth();

  const serverInfo = useQuery({
    queryKey: ["server-info"],
    queryFn: async () => API.getServerInfo(),
  });

  const status = useQuery({
    queryKey: ["status", generation, "public"],
    queryFn: async () => API.getStatus(generation, pokemonValidationGuess),
    enabled: !!generation,
  });

  const dayStats = useQuery({
    queryKey: ["day-stats"],
    queryFn: async () => API_ADMIN.getDayStats(),
    enabled: isAdmin,
  });

  const isLoading = useMemo(
    () => status.isFetching || dayStats.isFetching,
    [status.isFetching, dayStats.isFetching]
  );

  const refetch = useCallback(() => {
    dayStats.refetch();
    if (isAdmin) status.refetch();
  }, [dayStats, isAdmin, status]);

  return {
    status: status.data ?? undefined,
    dayStats: dayStats.data?.pokemonDayStats ?? undefined,
    isLoading,
    isLoadingServerInfo: serverInfo.isFetching,
    serverVersion: serverInfo.data?.version,
    refetch,
  };
};

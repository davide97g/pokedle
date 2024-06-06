import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GENERATION } from "../../../types/user.types";
import {
  PokedleDayStats,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { useStatusGetStatus } from "../hooks/status/useStatusGetStatus";
import dayjs from "dayjs";

interface StatusContext {
  offline: boolean;
  generation: GENERATION;
  gameStatus?: "PLAYING" | "WON";
  setGeneration: (generation: GENERATION) => void;
  guessFeedbackHistory: PokemonValidationGuess[];
  setGuessFeedbackHistory: (
    guessFeedbackHistory: PokemonValidationGuess[]
  ) => void;
  totalPokemon: number;
  remainingPokemon?: number;
  setRemainingPokemon?: (remainingPokemon: number) => void;
  dayStats?: PokedleDayStats;
  refetch: () => void;
  isLoading: boolean;
  reset: () => void;
}

export const StatusContext = createContext({
  offline: false,
  generation: "1",
  gameStatus: "PLAYING",
  setGeneration: () => {},
  guessFeedbackHistory: [],
  setGuessFeedbackHistory: () => {},
  sid: "",
  refetch: () => {},
  isLoading: false,
  dayStats: undefined,
  totalPokemon: 0,
  remainingPokemon: 0,
  reset: () => {},
} as StatusContext);

export function StatusProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [offline, setOffline] = useState<boolean>(Boolean);

  const [generation, setGeneration] = useState<GENERATION>(
    (localStorage.getItem("generation") as GENERATION) || "1"
  );

  const [guessFeedbackHistory, setGuessFeedbackHistory] = useState<
    PokemonValidationGuess[]
  >(
    JSON.parse((localStorage.getItem("guessFeedbackHistory") as string) || "[]")
  );

  const [sid, setSid] = useState<string>(
    (localStorage.getItem("sid") as string) || ""
  );

  const [gameStatus, setGameStatus] = useState<"PLAYING" | "WON">("PLAYING");
  const [remainingPokemon, setRemainingPokemon] = useState<number>();

  const hasWon = (feedbackGuess: PokemonValidationGuess) => {
    return (
      feedbackGuess.type1.valid &&
      feedbackGuess.type2.valid &&
      feedbackGuess.color.valid &&
      feedbackGuess.habitat.valid &&
      feedbackGuess.height.comparison === "equal" &&
      feedbackGuess.weight.comparison === "equal" &&
      feedbackGuess.evolutionStage.comparison === "equal"
    );
  };

  useEffect(() => {
    if (guessFeedbackHistory.length > 0) {
      if (guessFeedbackHistory.some((feedback) => hasWon(feedback))) {
        setTimeout(() => setGameStatus("WON"), 250);
      }
    }
  }, [guessFeedbackHistory]);

  const { status, refetch, isLoading, dayStats } = useStatusGetStatus({
    generation,
    pokemonValidationGuess: guessFeedbackHistory,
  });

  const reset = useCallback(() => {
    localStorage.removeItem("guessFeedbackHistory");
    localStorage.removeItem("generation");
    setGeneration("1");
    setGuessFeedbackHistory([]);
    setGameStatus("PLAYING");
  }, []);

  // *** update variable to local storage

  useEffect(() => {
    if (status?.sid && sid !== status?.sid) {
      setSid(status?.sid);
      localStorage.setItem("sid", status?.sid);
      reset();
    }
  }, [reset, sid, status?.sid]);

  useEffect(() => {
    localStorage.setItem("generation", generation);
  }, [generation]);

  useEffect(() => {
    localStorage.setItem(
      "guessFeedbackHistory",
      JSON.stringify(guessFeedbackHistory)
    );
  }, [guessFeedbackHistory]);

  useEffect(() => {
    if (status?.remainingPokemon) setRemainingPokemon(status?.remainingPokemon);
  }, [status?.remainingPokemon]);

  // ****

  // ? handle offline
  const handleOfflineChange = useCallback(() => {
    setOffline(!navigator.onLine);
  }, []);

  useEffect(() => {
    window.addEventListener("offline", handleOfflineChange);
    window.addEventListener("online", handleOfflineChange);
    handleOfflineChange();
    return () => {
      window.removeEventListener("offline", handleOfflineChange);
      window.removeEventListener("online", handleOfflineChange);
    };
  }, [handleOfflineChange]);

  // ? reset everything when day changes
  useEffect(() => {
    if (
      guessFeedbackHistory.some((feedback) =>
        dayjs(feedback.date).isBefore(dayjs(), "day")
      )
    )
      reset();
  }, [guessFeedbackHistory, reset]);

  const value = useMemo(
    () => ({
      offline,
      generation,
      gameStatus,
      setGeneration,
      guessFeedbackHistory,
      setGuessFeedbackHistory,
      refetch,
      isLoading,
      totalPokemon: status?.totalPokemon ?? 0,
      remainingPokemon,
      setRemainingPokemon,
      dayStats,
      reset,
    }),
    [
      offline,
      generation,
      gameStatus,
      guessFeedbackHistory,
      refetch,
      isLoading,
      status?.totalPokemon,
      remainingPokemon,
      dayStats,
      reset,
    ]
  );

  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
}

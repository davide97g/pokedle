import dayjs from "dayjs";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { updatePokemonToGuess } from "../services/dailyGuess";
import { PokemonValidationGuess } from "../types/pokemon.model";

interface StatusContext {
  gameStatus?: "PLAYING" | "WON";
  guessFeedbackHistory: PokemonValidationGuess[];
  setGuessFeedbackHistory: (
    guessFeedbackHistory: PokemonValidationGuess[]
  ) => void;
  reset: () => void;
}

export const StatusContext = createContext({
  gameStatus: "PLAYING",
  guessFeedbackHistory: [],
  setGuessFeedbackHistory: () => {},
  reset: () => {},
} as StatusContext);

export function StatusProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [guessFeedbackHistory, setGuessFeedbackHistory] = useState<
    PokemonValidationGuess[]
  >(
    JSON.parse((localStorage.getItem("guessFeedbackHistory") as string) || "[]")
  );

  const [gameStatus, setGameStatus] = useState<"PLAYING" | "WON">("PLAYING");

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

  const reset = useCallback(() => {
    localStorage.removeItem("guessFeedbackHistory");
    localStorage.removeItem("generation");
    updatePokemonToGuess();
    setGuessFeedbackHistory([]);
    setGameStatus("PLAYING");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, []);

  // *** update variable to local storage

  useEffect(() => {
    localStorage.setItem(
      "guessFeedbackHistory",
      JSON.stringify(guessFeedbackHistory)
    );
  }, [guessFeedbackHistory]);

  // ****

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
      gameStatus,
      guessFeedbackHistory,
      setGuessFeedbackHistory,
      reset,
    }),
    [gameStatus, guessFeedbackHistory, reset]
  );

  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
}

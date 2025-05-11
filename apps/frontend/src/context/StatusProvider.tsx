import dayjs from "dayjs";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { PokemonValidationGuess } from "@pokedle/types";

interface StatusContext {
  generation: number;
  setGeneration: (generation: number) => void;
  gameStatus?: "PLAYING" | "WON";
  guessFeedbackHistory: PokemonValidationGuess[];
  setGuessFeedbackHistory: (
    guessFeedbackHistory: PokemonValidationGuess[]
  ) => void;
  savedGuessNumber: number;
  reset: () => void;
  mute: boolean;
  toggleMute: () => void;
}

export const StatusContext = createContext({
  generation: 1,
  setGeneration: () => {},
  gameStatus: "PLAYING",
  guessFeedbackHistory: [],
  setGuessFeedbackHistory: () => {},
  reset: () => {},
  savedGuessNumber: 0,
  mute: false,
  toggleMute: () => {},
} as StatusContext);

export function StatusProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [generation, setGeneration] = useState<number>(
    Number(localStorage.getItem("generation")) || 1
  );
  const [mute, setMute] = useState(localStorage.getItem("mute") === "true");
  const toggleMute = useCallback(() => {
    setMute(!mute);
    localStorage.setItem("mute", (!mute).toString());
  }, [mute]);

  const [guessFeedbackHistory, setGuessFeedbackHistory] = useState<
    PokemonValidationGuess[]
  >(
    JSON.parse((localStorage.getItem("guessFeedbackHistory") as string) || "[]")
  );

  const savedGuessNumber = useMemo<number>(
    () =>
      JSON.parse(
        (localStorage.getItem("guessFeedbackHistory") as string) || "[]"
      ).length,
    []
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
        if (savedGuessNumber === guessFeedbackHistory.length) {
          setGameStatus("WON");
        } else setTimeout(() => setGameStatus("WON"), 7000);
      }
    }
  }, [guessFeedbackHistory, savedGuessNumber]);

  const reset = useCallback(() => {
    localStorage.removeItem("guessFeedbackHistory");
    localStorage.removeItem("generation");
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

  useEffect(() => {
    localStorage.setItem("generation", String(generation));
  }, [generation]);

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
      savedGuessNumber,
      generation,
      setGeneration,
      mute,
      toggleMute,
    }),
    [
      gameStatus,
      generation,
      guessFeedbackHistory,
      mute,
      reset,
      savedGuessNumber,
      toggleMute,
    ]
  );

  return (
    <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
  );
}

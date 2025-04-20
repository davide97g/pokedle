import confetti from "canvas-confetti";

import { Button, CircularProgress, ScrollShadow } from "@nextui-org/react";
import { lazy, Suspense, useEffect, useMemo } from "react";

import { GuessFeedback } from "../components/Guess/GuessFeedback";

import { GuessFeedbackHeader } from "../components/Guess/GuessFeedbackHeader";
import { useLayout } from "../hooks/useLayout";
import { useStatus } from "../hooks/useStatus";
import { sendGuessPokemonId } from "../services/guess";
import { PokemonSummary } from "../types/pokemon.model";

const PokemonSearchBar = lazy(() => import("../components/PokemonSearchBar"));

export default function Player() {
  const { isMobile } = useLayout();

  const { guessFeedbackHistory, gameStatus, setGuessFeedbackHistory, reset } =
    useStatus();

  useEffect(() => {
    if (gameStatus === "WON") {
      setTimeout(() => {
        const particleCount = Math.max(
          Math.floor(1000 - guessFeedbackHistory.length * 100),
          100
        );
        confetti({
          particleCount,
          spread: 100000,
        });
      }, 7500);
    }
  }, [gameStatus, guessFeedbackHistory.length]);

  const reversedGuessFeedbackHistory = useMemo(() => {
    return structuredClone(
      guessFeedbackHistory.sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
    );
  }, [guessFeedbackHistory]);

  const guessedPokemon = useMemo(() => {
    if (gameStatus === "WON") {
      const lastGuess = reversedGuessFeedbackHistory[0];
      if (lastGuess)
        return {
          id: lastGuess.id,
          name: lastGuess.name,
          image: lastGuess.image,
        } as PokemonSummary;
    }
    return undefined;
  }, [gameStatus, reversedGuessFeedbackHistory]);

  const guessPokemonById = (pokemonId: number) => {
    if (pokemonId) {
      sendGuessPokemonId(pokemonId, guessFeedbackHistory).then((response) => {
        const updatedHistory = [
          ...guessFeedbackHistory,
          { ...response.validation, order: guessFeedbackHistory.length },
        ];
        setGuessFeedbackHistory(updatedHistory);
      });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="pt-8 md:pt-20 flex flex-row items-center">
          <img src="./logo.png" alt="logo" height={45} width={45} />
          <h1 className="text-2xl">Pokedle</h1>
        </div>
        <Button variant="ghost" color="danger" onClick={reset}>
          Reset
        </Button>
      </div>

      <p className="text-xs text-white/50 flex justify-end mr-2">
        First Generation
      </p>

      {/* SEARCH BAR */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <CircularProgress color="default" aria-label="Loading..." />
          </div>
        }
      >
        <PokemonSearchBar
          gameStatus={gameStatus}
          guessPokemonById={guessPokemonById}
        />
      </Suspense>

      {/* VALIDATION LINES */}
      {Boolean(reversedGuessFeedbackHistory.length) && (
        <div className="flex flex-col gap-2 max-w-full px-2">
          {gameStatus === "WON" && (
            <p className="text-xs text-white/50 flex justify-end mr-2">
              🎉 Congratulations! You found{" "}
              <span className="font-bold px-1">{guessedPokemon?.name}</span> in{" "}
              {guessFeedbackHistory.length} guesses!
            </p>
          )}
          <div className="flex flex-row sm:flex-col gap-2">
            <GuessFeedbackHeader />
            <ScrollShadow
              className="w-[300px] sm:w-full sm:max-h-[33rem]"
              hideScrollBar
              size={40}
              orientation={isMobile ? "horizontal" : "vertical"}
            >
              <div className="flex flex-row sm:flex-col gap-2">
                {reversedGuessFeedbackHistory.map((guess) => (
                  <GuessFeedback
                    key={`${guess.id}-${guess.order ?? 0}`}
                    guess={guess}
                  />
                ))}
              </div>
            </ScrollShadow>
          </div>
        </div>
      )}
    </>
  );
}

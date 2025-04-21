import { Button, CircularProgress, ScrollShadow } from "@nextui-org/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

import { GuessFeedback } from "../components/Guess/GuessFeedback";

import { Reset } from "@carbon/icons-react";
import { GuessFeedbackHeader } from "../components/Guess/GuessFeedbackHeader";
import { WinningModal } from "../components/WinningModal";
import { useLayout } from "../hooks/useLayout";
import { useStatus } from "../hooks/useStatus";
import { sendGuessPokemonId } from "../services/guess";
import { PokemonSummary } from "../types/pokemon.model";

const PokemonSearchBar = lazy(() => import("../components/PokemonSearchBar"));

export default function Player() {
  const { isMobile } = useLayout();

  const [winningModalOpen, setWinningModalOpen] = useState(false);

  const {
    savedGuessNumber,
    guessFeedbackHistory,
    gameStatus,
    setGuessFeedbackHistory,
    reset,
  } = useStatus();

  useEffect(() => {
    if (gameStatus === "WON") setWinningModalOpen(true);
  }, [gameStatus]);

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
          color: lastGuess.color.value,
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

  const startNewGame = () => {
    reset();
    setGuessFeedbackHistory([]);
    setWinningModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="pt-8 md:pt-20 flex flex-row items-center gap-2">
          <img src="./logo.png" alt="logo" height={45} width={45} />
          <h1 className="text-2xl">Pokedle</h1>
        </div>
        <Reset
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
          }}
          color="danger"
          className="w-5 h-5"
          onClick={reset}
        />
      </div>

      <p className="text-xs text-white/50 flex justify-end mr-2">
        Guess the hidden pokemon between the "First Generation"
      </p>

      {gameStatus === "WON" && (
        <Button
          className="flex-shrink-0"
          color="primary"
          onPress={startNewGame}
        >
          Start New Game
        </Button>
      )}

      {/* SEARCH BAR */}
      <div
        style={{
          ...(isMobile && {
            position: "fixed",
            bottom: "0%",
            left: "50%",
            transform: "translate(-50%, 0%)",
            zIndex: 10,
            width: "100%",
          }),
        }}
      >
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
      </div>

      {/* VALIDATION LINES */}
      {Boolean(reversedGuessFeedbackHistory.length) && (
        <div className="flex flex-col gap-2 max-w-full px-2 mt-5">
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
              className=" md:w-full sm:max-h-[33rem]"
              hideScrollBar
              size={40}
              orientation={isMobile ? "horizontal" : "vertical"}
            >
              <div className="flex flex-row sm:flex-col gap-2">
                {reversedGuessFeedbackHistory.map((guess) => (
                  <GuessFeedback
                    key={`${guess.id}-${guess.order ?? 0}`}
                    guess={guess}
                    isNew={savedGuessNumber > (guess.order ?? 0)}
                  />
                ))}
              </div>
            </ScrollShadow>
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {winningModalOpen && (
        <WinningModal
          pokemon={guessedPokemon as PokemonSummary}
          numberOfGuesses={guessFeedbackHistory.length}
          onRestart={startNewGame}
          onClose={() => {
            setWinningModalOpen(false);
          }}
        />
      )}
    </>
  );
}

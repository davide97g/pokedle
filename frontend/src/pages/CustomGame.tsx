import confetti from "canvas-confetti";

import { Add } from "@carbon/icons-react";
import {
  Button,
  CircularProgress,
  Progress,
  ScrollShadow,
} from "@nextui-org/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { PokemonSummary } from "../../../types/pokemon.model";
import { GuessFeedback } from "../components/GuessFeedback";
import { GuessFeedbackHeader } from "../components/GuessFeedbackHeader";

import { useNavigate } from "react-router-dom";
import User from "../components/User";
import { useAuth } from "../hooks/useAuth";
import { useLayout } from "../hooks/useLayout";
import { useStatus } from "../hooks/useStatus";
import { API_PRO } from "../services/api";

const PokemonSearchBar = lazy(() => import("../components/PokemonSearchBar"));
const Guess = lazy(() => import("../components/Guess"));

export default function CustomGame() {
  const { isLogged, isAdmin, refetch, user } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useLayout();
  const [isLoading, setIsLoading] = useState(false);
  const {
    generation,
    guessFeedbackHistory,
    totalPokemon,
    remainingPokemon,
    gameStatus,
    isLoading: isLoadingStatus,
    setGuessFeedbackHistory,
    setRemainingPokemon,
    setMode,
    reset,
  } = useStatus();

  useEffect(() => setMode("CUSTOM"), [setMode]);

  useEffect(() => {
    if (!isLogged) navigate("/login");
  }, [isLogged, navigate]);

  useEffect(() => {
    if (gameStatus === "WON") {
      const particleCount = Math.max(
        Math.floor(1000 - guessFeedbackHistory.length * 100),
        100
      );
      confetti({
        particleCount,
        spread: 100000,
      });
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
      setIsLoading(true);
      API_PRO.sendGuessPokemonId(pokemonId, generation, guessFeedbackHistory)
        .then((response) => {
          if (response) {
            const updatedHistory = [
              ...guessFeedbackHistory,
              { ...response.validation, order: guessFeedbackHistory.length },
            ];
            setGuessFeedbackHistory(updatedHistory);
            setRemainingPokemon?.(response.remainingPokemon);
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const applyBestGuess = () => {
    if (isLogged) {
      setIsLoading(true);
      API_PRO.getBestSuggestion(guessFeedbackHistory, generation)
        .then((res) => {
          if (res) {
            setTimeout(() => {
              refetch();
            }, 500);
            guessPokemonById(res.id);
          }
        })
        .finally(() => setIsLoading(false));
    } else console.warn("You need to logged to use this feature");
  };

  return (
    <>
      {(isLoading || isLoadingStatus) && (
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="absolute w-screen z-50 top-0"
        />
      )}
      <User />
      <div className="flex flex-col justify-center items-center">
        <div className="pt-8 md:pt-20 flex flex-row items-center">
          <img src="./logo.png" alt="logo" height={45} width={45} />
          <h1 className="text-2xl">Pokedle Custom</h1>
        </div>
      </div>
      {/* GUESS */}
      {isAdmin && (
        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <CircularProgress color="default" aria-label="Loading..." />
            </div>
          }
        >
          <Guess pokemonToGuess={user?.customPokemonGuess} />
        </Suspense>
      )}
      {isLogged && (
        <div className="flex flex-col gap-4 absolute top-2 left-2 sm:top-4 sm:left-4">
          <Button
            size={isMobile ? "sm" : "md"}
            isIconOnly={isMobile}
            onClick={() => {
              setIsLoading(true);
              if (isLogged)
                API_PRO.newPokemon().finally(() => {
                  refetch();
                  reset();
                  setIsLoading(false);
                });
            }}
            color="danger"
            startContent={<Add />}
          >
            {isMobile ? "" : "New Pokemon"}
          </Button>
        </div>
      )}

      {/* SEARCH BAR */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <CircularProgress color="default" aria-label="Loading..." />
          </div>
        }
      >
        <PokemonSearchBar
          generation={generation}
          gameStatus={gameStatus}
          guessPokemonById={guessPokemonById}
          applyBestGuess={applyBestGuess}
        />
      </Suspense>

      {/* VALIDATION LINES */}
      {Boolean(reversedGuessFeedbackHistory.length) && (
        <div className="flex flex-col gap-2 max-w-full px-2">
          {remainingPokemon ? (
            <p className="text-xs text-white/50 flex justify-end mr-2">
              {remainingPokemon}/{totalPokemon} left
            </p>
          ) : (
            <p className="text-xs text-white/50 flex justify-end mr-2">
              🎉 Congratulations! You found{" "}
              <span className="font-bold px-1">{guessedPokemon?.name}</span> in{" "}
              {guessFeedbackHistory.length} guesses!
            </p>
          )}
          <Progress
            aria-label="Loading..."
            value={Math.max(
              Math.round(
                (100 * ((totalPokemon ?? 0) - (remainingPokemon ?? 0))) /
                  (totalPokemon ?? 1)
              ),
              1
            )}
          />
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

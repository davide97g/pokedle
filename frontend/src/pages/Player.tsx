import confetti from "canvas-confetti";

import { Add, Restart, Rocket } from "@carbon/icons-react";
import {
  Button,
  CircularProgress,
  Progress,
  ScrollShadow,
} from "@nextui-org/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { PokemonSummary } from "../../../types/pokemon.model";
import { GuessFeedback } from "../components/Guess/GuessFeedback";

import { Counter } from "../components/Counter";

import { useNavigate } from "react-router-dom";
import { GuessFeedbackHeader } from "../components/Guess/GuessFeedbackHeader";
import User from "../components/User";
import { useAuth } from "../hooks/useAuth";
import { useLayout } from "../hooks/useLayout";
import { useStatus } from "../hooks/useStatus";
import { API, API_ADMIN, API_PRO } from "../services/api";

const PokemonSearchBar = lazy(() => import("../components/PokemonSearchBar"));
const Guess = lazy(() => import("../components/Guess/Guess"));

export default function Player() {
  const { isLogged, isAdmin, refetch } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useLayout();
  const [isLoading, setIsLoading] = useState(false);
  const {
    generation,
    guessFeedbackHistory,
    totalPokemon,
    remainingPokemon,
    dayStats,
    gameStatus,
    isLoading: isLoadingStatus,
    setGuessFeedbackHistory,
    setRemainingPokemon,
    reset,
    setMode,
    refetch: refetchStatus,
  } = useStatus();

  useEffect(() => setMode("CUSTOM"), [setMode]);

  // const generations = [
  //   { value: "1", label: "Generation 1" },
  //   { value: "2", label: "Generation 2" },
  //   { value: "3", label: "Generation 3" },
  //   { value: "4", label: "Generation 4" },
  //   { value: "5", label: "Generation 5" },
  //   { value: "6", label: "Generation 6" },
  //   { value: "7", label: "Generation 7" },
  //   { value: "8", label: "Generation 8" },
  //   { value: "9", label: "Generation 9" },
  // ];

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
      setIsLoading(true);
      API.sendGuessPokemonId(pokemonId, generation, guessFeedbackHistory)
        .then((response) => {
          const updatedHistory = [
            ...guessFeedbackHistory,
            { ...response.validation, order: guessFeedbackHistory.length },
          ];
          setGuessFeedbackHistory(updatedHistory);
          setRemainingPokemon?.(response.remainingPokemon);
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
          <h1 className="text-2xl">Pokedle</h1>
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
          <Guess
            pokemonToGuess={
              dayStats?.pokemonList.find((p) => p.gen === generation)?.pokemon
            }
          />
        </Suspense>
      )}
      {/* <Select
        label="Generation"
        variant="bordered"
        placeholder="Select an generation"
        selectedKeys={generation}
        isDisabled
        className="max-w-xs w-48"
        multiple={false}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSelectionChange={(keys: any) => {
          if (keys) setGeneration(keys.currentKey as GENERATION);
        }}
      >
        {generations.map((gen) => (
          <SelectItem
            className="text-gray-600"
            key={gen.value}
            value={gen.value}
          >
            {gen.label}
          </SelectItem>
        ))}
      </Select> */}
      <p className="text-xs text-white/50 flex justify-end mr-2">
        Generation 1
      </p>

      {isLogged && (
        <div className="flex flex-col gap-4 absolute top-2 left-2 sm:top-4 sm:left-4">
          <Button
            isIconOnly={isMobile}
            size={isMobile ? "sm" : "md"}
            isDisabled={!guessFeedbackHistory.length}
            onClick={reset}
            startContent={<Restart />}
            variant="ghost"
          >
            {isMobile ? "" : "Restart"}
          </Button>
          {isAdmin && (
            <Button
              size={isMobile ? "sm" : "md"}
              isIconOnly={isMobile}
              onClick={() => {
                setIsLoading(true);
                if (isAdmin)
                  API_ADMIN.newPokemon().finally(() => {
                    refetchStatus();
                    setIsLoading(false);
                  });
              }}
              color="danger"
              startContent={<Add />}
            >
              {isMobile ? "" : "New Pokemon"}
            </Button>
          )}
          <Button
            isIconOnly={isMobile}
            size={isMobile ? "sm" : "md"}
            onClick={() => navigate("/custom")}
            startContent={<Rocket />}
            color="success"
          >
            {isMobile ? "" : "Custom"}
          </Button>
        </div>
      )}

      <Counter />

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

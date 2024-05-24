import confetti from "canvas-confetti";

import { Add, Restart } from "@carbon/icons-react";
import {
  Button,
  CircularProgress,
  Progress,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  PokemonModel,
  PokemonSummary,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { GuessFeedback } from "../components/GuessFeedback";
import { GuessFeedbackHeader } from "../components/GuessFeedbackHeader";

import { API } from "../services/api";
import { GENERATION } from "../types";
import { useUser } from "../hooks/useUser";

const PokemonSearchBar = lazy(() => import("../components/PokemonSearchBar"));
const Guess = lazy(() => import("../components/Guess"));

export const Player = () => {
  const { isAdmin, isPro } = useUser();
  const isMobile = window.innerWidth < 640;
  const [isLoading, setIsLoading] = useState(false);

  const [showGoal, setShowGoal] = useState(
    localStorage.getItem("showGoal") === "true"
  );
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [pokemonToGuess, setPokemonToGuess] = useState<PokemonModel>();

  const [remainingPokemon, setRemainingPokemon] = useState<number>();

  const [generation, setGeneration] = useState<GENERATION>(
    (localStorage.getItem("generation") as GENERATION) || "1"
  );
  const generations = [
    { value: "1", label: "Generation 1" },
    { value: "2", label: "Generation 2" },
    { value: "3", label: "Generation 3" },
    { value: "4", label: "Generation 4" },
    { value: "5", label: "Generation 5" },
    { value: "6", label: "Generation 6" },
    { value: "7", label: "Generation 7" },
    { value: "8", label: "Generation 8" },
    { value: "9", label: "Generation 9" },
  ];

  const [gameStatus, setGameStatus] = useState<"PLAYING" | "WON">("PLAYING");

  const [guessFeedbackHistory, setGuessFeedbackHistory] = useState<
    PokemonValidationGuess[]
  >(
    localStorage.getItem("guessFeedbackHistory")
      ? (JSON.parse(
          localStorage.getItem("guessFeedbackHistory") as string
        ) as PokemonValidationGuess[])
      : []
  );

  useEffect(() => {
    if (isAdmin) localStorage.setItem("showGoal", showGoal.toString());
  }, [isAdmin, showGoal]);

  useEffect(() => {
    localStorage.setItem("generation", generation);
  }, [generation]);

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

  useEffect(() => {
    if (guessFeedbackHistory.length > 0) {
      if (guessFeedbackHistory.some((feedback) => hasWon(feedback))) {
        setTimeout(() => setGameStatus("WON"), 250);
      }
    }
  }, [guessFeedbackHistory]);

  const reversedGuessFeedbackHistory = useMemo(() => {
    return structuredClone(
      guessFeedbackHistory.sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
    );
  }, [guessFeedbackHistory]);

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

  const guessedPokemon = useMemo(() => {
    if (gameStatus === "WON")
      return pokemonList.find(
        (p) => p.id === reversedGuessFeedbackHistory[0].id
      );
    return undefined;
  }, [gameStatus, reversedGuessFeedbackHistory, pokemonList]);

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
          setRemainingPokemon(response.remainingPokemon);
          localStorage.setItem(
            "guessFeedbackHistory",
            JSON.stringify(updatedHistory)
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  const applyBestGuess = () => {
    if (isPro || isAdmin) {
      setIsLoading(true);
      API.getBestSuggestion(guessFeedbackHistory, generation)
        .then((res) => {
          if (res) {
            guessPokemonById(res.id);
          }
        })
        .finally(() => setIsLoading(false));
    } else console.warn("You need to be a pro to use this feature");
  };

  useEffect(() => {
    setIsLoading(true);
    API.getPokemons(generation)
      .then((res) => {
        if (res) {
          setPokemonList(res);
        }
      })
      .finally(() => setIsLoading(false));
  }, [generation]);

  useEffect(() => {
    setIsLoading(true);
    if (isAdmin) {
      API.getStatusAdmin(generation, guessFeedbackHistory)
        .then((res) => {
          setPokemonToGuess(res?.pokemonToGuess);
          setRemainingPokemon(res?.remainingPokemon);
        })
        .finally(() => setIsLoading(false));
    } else
      API.getStatus(generation, guessFeedbackHistory)
        .then((res) => {
          setRemainingPokemon(res?.remainingPokemon);
        })
        .finally(() => setIsLoading(false));
  }, [generation, guessFeedbackHistory, isAdmin]);

  return (
    <>
      {isLoading && (
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="absolute w-screen z-50 top-0"
        />
      )}
      <div className="pt-28 md:pt-20 flex flex-row items-center">
        <img src="./logo.png" alt="logo" height={45} width={45} />
        <h1 className="text-2xl">Pokedle</h1>
      </div>
      <Select
        label="Generation"
        variant="bordered"
        placeholder="Select an generation"
        selectedKeys={generation}
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
      </Select>

      <div
        className="flex flex-col gap-4"
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
        }}
      >
        <Button
          isIconOnly={isMobile}
          size={isMobile ? "sm" : "md"}
          isDisabled={!guessFeedbackHistory.length}
          onClick={() => {
            localStorage.removeItem("guessFeedbackHistory");
            setGuessFeedbackHistory([]);
            setGameStatus("PLAYING");
          }}
          startContent={<Restart />}
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
                API.newPokemon(generation)
                  .then(() => {
                    window.location.reload();
                    localStorage.removeItem("guessFeedbackHistory");
                    setGuessFeedbackHistory([]);
                  })
                  .finally(() => setIsLoading(false));
            }}
            color="danger"
            startContent={<Add />}
          >
            {isMobile ? "" : "New Pokemon"}
          </Button>
        )}
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
            showGoal={showGoal}
            setShowGoal={setShowGoal}
            pokemonToGuess={pokemonToGuess}
          />
        </Suspense>
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
          pokemonList={pokemonList}
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
              {remainingPokemon}/{pokemonList.length} left
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
                (100 * (pokemonList.length - (remainingPokemon ?? 0))) /
                  pokemonList.length
              ),
              1
            )}
          />
          <div className="flex flex-row sm:flex-col gap-2 overflow-auto">
            <GuessFeedbackHeader />
            <div className="flex flex-row sm:flex-col gap-2 overflow-auto sm:max-h-[36rem]">
              {reversedGuessFeedbackHistory.map((guess) => (
                <GuessFeedback
                  key={guess.id}
                  guess={guess}
                  pokemon={pokemonList.find((p) => p.id === guess.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

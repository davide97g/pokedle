import { Button } from "@heroui/button";
import { CircularProgress } from "@heroui/progress";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

import { GuessFeedback } from "../components/Guess/GuessFeedback";

import { Reset, StarFilled } from "@carbon/icons-react";
import { Tooltip } from "@heroui/tooltip";
import { PokemonSummary } from "@pokedle/types";
import { GenerationSelection } from "../components/GenerationSelection";
import { GuessFeedbackHeader } from "../components/Guess/GuessFeedbackHeader";
import { Loader } from "../components/shared/loader/Loader";
import { WinningModal } from "../components/WinningModal";
import { useAuth } from "../context/AuthProvider";
import { useGetBestGuessPokemon } from "../hooks/pokemon/useGetBestGuessPokemon";
import { useSendGuessPokemon } from "../hooks/pokemon/useSendGuessPokemon";
import { useLayout } from "../hooks/useLayout";
import { useStatus } from "../hooks/useStatus";

const PokemonSearchBar = lazy(() => import("../components/PokemonSearchBar"));

export default function Player() {
  const { isMobile } = useLayout();

  const { user } = useAuth();

  const sendGuessPokemon = useSendGuessPokemon();

  const [winningModalOpen, setWinningModalOpen] = useState(false);

  const {
    savedGuessNumber,
    guessFeedbackHistory,
    gameStatus,
    setGuessFeedbackHistory,
    reset,
    generation,
    setGeneration,
    mute,
  } = useStatus();

  const playPokemonBattelcry = (pokemonId: number) => {
    if (mute) return;
    const audio = new Audio(
      `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`
    );
    audio.volume = 0.35;
    audio.play().catch((e) => {
      console.error("Error playing sound:", e);
    });
  };

  const playWinningSound = () => {
    if (mute) return;
    const audio = new Audio("/audio/victory.mp3");
    audio.volume = 0.35;
    audio.play().catch((e) => {
      console.error("Error playing sound:", e);
    });
  };

  const getBestGuessPokemon = useGetBestGuessPokemon({
    previouslyGuessedPokemonIdList: guessFeedbackHistory
      .map((guess) => guess.id)
      .filter(Boolean) as number[],
    gen: generation,
  });

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
      sendGuessPokemon
        .mutateAsync({
          pokemonId,
          guessNumber: guessFeedbackHistory.length + 1,
          gen: generation,
        })
        .then(({ validation }) => {
          const updatedHistory = [
            ...guessFeedbackHistory,
            { ...validation, order: guessFeedbackHistory.length },
          ];
          if (validation.correct) setTimeout(() => playWinningSound(), 7000);
          playPokemonBattelcry(pokemonId);
          setGuessFeedbackHistory(updatedHistory);
        });
    }
  };

  const handleBestGuessPokemon = () => {
    if (!user) return;

    getBestGuessPokemon.refetch().then((response) => {
      if (response.data) {
        const { pokemon, score } = response.data;
        console.log("Best guess pokemon:", pokemon, score);
        guessPokemonById(pokemon.id);
      }
    });
  };

  const startNewGame = () => {
    reset();
    setGuessFeedbackHistory([]);
    setWinningModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="md:pt-20 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-400 bg-clip-text text-transparent">
            Guess the Pokémon!
          </h2>
        </div>

        <GenerationSelection
          value={generation}
          onChange={setGeneration}
          disabled={!!guessFeedbackHistory.length}
        />
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center items-center">
            <CircularProgress color="default" aria-label="Loading..." />
          </div>
        }
      >
        <div className="flex flex-row items-center gap-4 w-full px-4 max-w-[60rem]">
          {/* SEARCH BAR */}
          <PokemonSearchBar
            gameStatus={gameStatus}
            guessPokemonById={guessPokemonById}
            gen={generation}
          />

          {!!user && (
            <Button
              className="flex-shrink-0"
              color="primary"
              onPress={handleBestGuessPokemon}
              isDisabled={gameStatus === "WON"}
              variant="shadow"
              isIconOnly={isMobile}
            >
              {isMobile ? "" : "Best Guess"}
              <StarFilled />
            </Button>
          )}
          {/* START NEW GAME */}
          {gameStatus === "WON" && (
            <Tooltip
              content={"Start a new game"}
              className="px-1.5 text-tiny text-default-600 rounded-small"
              placement="top"
            >
              <Button
                className="flex-shrink-0"
                color="success"
                onPress={startNewGame}
                isIconOnly={isMobile}
              >
                {isMobile ? "" : "New Game"}
                <Reset />
              </Button>
            </Tooltip>
          )}
        </div>
      </Suspense>

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
          isOpen
          pokemon={guessedPokemon as PokemonSummary}
          guessCount={guessFeedbackHistory.length}
          onNewGame={startNewGame}
          onClose={() => {
            setWinningModalOpen(false);
          }}
        />
      )}

      {sendGuessPokemon.isPending && getBestGuessPokemon.isLoading && (
        <Loader />
      )}
    </>
  );
}

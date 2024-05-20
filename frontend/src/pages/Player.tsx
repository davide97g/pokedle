// @ts-expect-error - import direct from link
import confetti from "https://cdn.skypack.dev/canvas-confetti";

import { Add, Restart, StarFilled } from "@carbon/icons-react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  Image,
  Progress,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import {
  PokemonModel,
  PokemonSummary,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { GuessFeedback } from "../components/GuessFeedback";
import { GuessFeedbackHeader } from "../components/GuessFeedbackHeader";
import { Loader } from "../components/Loader";
import { API } from "../services/api";
import { GENERATION } from "../types";

export const Player = () => {
  const [initialLoading, setInitialLoading] = useState(true);
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
    localStorage.setItem("showGoal", showGoal.toString());
  }, [showGoal]);

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
    console.log(guessFeedbackHistory);
    if (guessFeedbackHistory.length > 0) {
      if (guessFeedbackHistory.some((feedback) => hasWon(feedback))) {
        setTimeout(() => setGameStatus("WON"), 1000);
      }
    }
  }, [guessFeedbackHistory]);

  const reversedGuessFeedbackHistory = useMemo(() => {
    return structuredClone(guessFeedbackHistory).reverse();
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

  const guessPokemonById = (pokemonId: number) => {
    if (pokemonId) {
      setIsLoading(true);
      API.sendGuessPokemonId(pokemonId, generation, guessFeedbackHistory)
        .then((response) => {
          const updatedHistory = [...guessFeedbackHistory, response.validation];
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
    // TODO: check license
    setIsLoading(true);
    API.getBestSuggestion(guessFeedbackHistory, generation)
      .then((res) => {
        if (res) {
          guessPokemonById(res.id);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    API.getPokemons(generation)
      .then((res) => {
        if (res) {
          setPokemonList(res);
        }
      })
      .finally(() => {
        setInitialLoading(false);
        setIsLoading(false);
      });
  }, [generation]);

  useEffect(() => {
    setIsLoading(true);
    API.getStatus(generation, guessFeedbackHistory)
      .then((res) => {
        setPokemonToGuess(res?.pokemonToGuess);
        setRemainingPokemon(res?.remainingPokemon);
      })
      .finally(() => setIsLoading(false));
  }, [generation, guessFeedbackHistory]);

  return (
    <>
      {(isLoading || initialLoading) && <Loader />}
      <div className="flex flex-row items-center">
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
          isDisabled={!guessFeedbackHistory.length}
          onClick={() => {
            localStorage.removeItem("guessFeedbackHistory");
            setGuessFeedbackHistory([]);
            setGameStatus("PLAYING");
          }}
          startContent={<Restart />}
        >
          Restart
        </Button>
        <Button
          onClick={() => {
            setIsLoading(true);
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
          New Pokemon
        </Button>
      </div>

      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
        }}
        className="flex flex-col gap-4 items-end"
      >
        <Switch size="sm" isSelected={showGoal} onValueChange={setShowGoal}>
          Show Goal
        </Switch>
        {showGoal && pokemonToGuess && (
          <Card>
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src={pokemonToGuess?.image}
            />
          </Card>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-center items-center flex-row gap-12 w-full">
        {pokemonList.length > 0 && (
          <Autocomplete
            isDisabled={gameStatus === "WON"}
            defaultItems={pokemonList}
            variant="bordered"
            label="Choose a pokemon"
            labelPlacement="inside"
            className="max-w-xs"
            onSelectionChange={(pokemonId) => {
              if (pokemonId) {
                guessPokemonById(Number(pokemonId));
              }
            }}
          >
            {(pokemon) => (
              <AutocompleteItem
                key={pokemon.id}
                textValue={pokemon.name}
                className="bg-background"
              >
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={pokemon.name}
                    className="flex-shrink-0"
                    size="sm"
                    src={pokemon.image}
                  />
                  <div className="flex flex-col">
                    <span className="text-small text-gray-600 capitalize">
                      {pokemon.name}
                    </span>
                  </div>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>
        )}
        <Button
          color="primary"
          isDisabled={gameStatus === "WON"}
          onClick={applyBestGuess}
          startContent={<StarFilled />}
        >
          Best Guess
        </Button>
      </div>
      {/* VALIDATION LINES */}
      {Boolean(reversedGuessFeedbackHistory.length) && (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[39rem]">
          {Boolean(remainingPokemon) && (
            <p className="text-xs text-white/50">
              {remainingPokemon}/{pokemonList.length} left
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
          <GuessFeedbackHeader />
          {reversedGuessFeedbackHistory.reverse().map((guess) => (
            <GuessFeedback
              key={guess.id}
              guess={guess}
              pokemon={pokemonList.find((p) => p.id === guess.id)}
            />
          ))}
        </div>
      )}
    </>
  );
};

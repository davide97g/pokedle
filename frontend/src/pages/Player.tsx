// @ts-expect-error - import direct from link
import confetti from "https://cdn.skypack.dev/canvas-confetti";

import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  Image,
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
import {
  getPokemons,
  getStatus,
  getBestSuggestion,
  sendGuessPokemonId,
  newPokemon,
  GENERATION,
} from "../services/api";

export const Player = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [showGoal, setShowGoal] = useState(false);
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [pokemonToGuess, setPokemonToGuess] = useState<PokemonModel>();

  const [generation, setGeneration] = useState<GENERATION>("1");
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
      sendGuessPokemonId(pokemonId, generation).then((response) => {
        {
          const updatedHistory = [...guessFeedbackHistory, response];
          setGuessFeedbackHistory(updatedHistory);
          localStorage.setItem(
            "guessFeedbackHistory",
            JSON.stringify(updatedHistory)
          );
        }
      });
    }
  };

  useEffect(() => {
    getPokemons(generation)
      .then((res) => {
        if (res) {
          setPokemonList(res);
        }
      })
      .finally(() => setInitialLoading(false));
  }, [generation]);

  useEffect(() => {
    getStatus().then((res) => setPokemonToGuess(res?.pokemonToGuess));
  }, []);

  if (initialLoading) return <div>Loading...</div>;

  return (
    <>
      <h1 className="text-3xl">Pokedle</h1>
      <Switch isSelected={showGoal} onValueChange={setShowGoal}>
        Show Goal
      </Switch>
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
      {guessFeedbackHistory.length > 0 && (
        <Button
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
          }}
          onClick={() => {
            localStorage.removeItem("guessFeedbackHistory");
            setGuessFeedbackHistory([]);
            setGameStatus("PLAYING");
          }}
        >
          Restart
        </Button>
      )}

      {showGoal && pokemonToGuess && (
        <Card
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
          }}
        >
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={pokemonToGuess?.image}
          />
          <Button
            onClick={() =>
              newPokemon(generation).then(() => {
                window.location.reload();
                localStorage.removeItem("guessFeedbackHistory");
                setGuessFeedbackHistory([]);
              })
            }
            color="danger"
          >
            New Pokemon
          </Button>
        </Card>
      )}

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
          variant="ghost"
          className="px-2"
          isDisabled={gameStatus === "WON"}
          onClick={() => {
            getBestSuggestion(guessFeedbackHistory, generation).then((res) => {
              if (res) {
                guessPokemonById(res.id);
              }
            });
          }}
        >
          <p>Best Guess</p>
        </Button>
      </div>

      {/* VALIDATION LINES */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[39rem]">
        {reversedGuessFeedbackHistory.reverse().map((guess) => (
          <GuessFeedback
            key={guess.id}
            guess={guess}
            pokemon={pokemonList.find((p) => p.id === guess.id)}
          />
        ))}
      </div>
    </>
  );
};

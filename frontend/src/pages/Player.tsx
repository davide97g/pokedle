import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  Image,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  PokemonModel,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { GuessFeedback } from "../components/GuessFeedback";
import {
  getPokemons,
  getStatus,
  getBestSuggestion,
  sendGuessPokemonId,
  newPokemon,
} from "../services/api";

export const Player = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState<PokemonModel[]>([]);
  const [pokemonToGuess, setPokemonToGuess] = useState<PokemonModel>();

  const [guessFeedbackHistory, setGuessFeedbackHistory] = useState<
    PokemonValidationGuess[]
  >(
    localStorage.getItem("guessFeedbackHistory")
      ? (JSON.parse(
          localStorage.getItem("guessFeedbackHistory") as string
        ) as PokemonValidationGuess[])
      : []
  );

  const guessPokemonById = (pokemonId: number) => {
    if (pokemonId) {
      sendGuessPokemonId(pokemonId).then((response) => {
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
    getPokemons()
      .then((res) => {
        if (res) {
          setPokemonList(res);
        }
      })
      .finally(() => setInitialLoading(false));
  }, []);

  useEffect(() => {
    getStatus().then((res) => setPokemonToGuess(res?.pokemonToGuess));
  }, []);

  if (initialLoading) return <div>Loading...</div>;

  return (
    <>
      <h1 className="text-3xl">Pokedle</h1>
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
          }}
        >
          Restart
        </Button>
      )}

      {pokemonToGuess && (
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
            src={pokemonToGuess?.sprite}
          />
          <Button
            onClick={() =>
              newPokemon().then(() => {
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
                    src={pokemon.sprite}
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
          onClick={() => {
            getBestSuggestion(guessFeedbackHistory).then((res) => {
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
      <div className="flex flex-col gap-2">
        {guessFeedbackHistory.map((guess) => (
          <GuessFeedback
            key={crypto.randomUUID()}
            guess={guess}
            pokemon={pokemonList.find((p) => p.id === guess.id)}
          />
        ))}
      </div>
    </>
  );
};

import { StarFilled } from "@carbon/icons-react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
} from "@nextui-org/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import { API } from "../services/api";
import { GENERATION } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";

export default function PokemonSearchBar({
  generation,
  gameStatus,
  guessPokemonById,
  applyBestGuess,
}: Readonly<{
  generation: GENERATION;
  gameStatus: "PLAYING" | "WON";
  guessPokemonById: (pokemonId: number) => void;
  applyBestGuess: () => void;
}>) {
  const { isLogged } = useAuth();

  const [pokemonNameFilter, setPokemonNameFilter] = useState("");
  const deferredPokemonNameFilter = useDebounce(pokemonNameFilter, 500);

  const {
    data: pokemonList,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["pokemon", generation, deferredPokemonNameFilter],
    queryFn: () =>
      API.getPokemons({ gen: generation, name: deferredPokemonNameFilter }),
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [deferredPokemonNameFilter, generation, refetch]);

  return (
    <div className="flex justify-center items-center flex-row gap-4  sm:gap-12 w-full">
      <Autocomplete
        size="sm"
        isDisabled={gameStatus === "WON"}
        defaultItems={pokemonList ?? []}
        variant="bordered"
        label="Choose a pokemon"
        labelPlacement="inside"
        className="max-w-[250px] autocomplete"
        inputValue={pokemonNameFilter}
        onInputChange={(value) => setPokemonNameFilter(value)}
        onSelectionChange={(pokemonId) => {
          if (pokemonId) {
            setPokemonNameFilter("");
            guessPokemonById(Number(pokemonId));
          }
        }}
        isLoading={isFetching}
      >
        {(pokemon) => (
          <AutocompleteItem
            key={pokemon.id}
            textValue={pokemon.name}
            // className="bg-background"
          >
            <div className="flex gap-2 items-center">
              <Avatar
                alt={pokemon.name}
                className="flex-shrink-0"
                size="md"
                src={pokemon.image}
              />
              <div className="flex flex-row justify-between w-full">
                <span className="text-small text-gray-600 capitalize">
                  {pokemon.name}
                </span>
                <span className="text-xs text-gray-400">#{pokemon.id}</span>
              </div>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
      {isLogged && (
        <Button
          size="sm"
          className="w-24"
          color="primary"
          isDisabled={gameStatus === "WON"}
          onClick={applyBestGuess}
          startContent={<StarFilled />}
        >
          Best Guess
        </Button>
      )}
    </div>
  );
}

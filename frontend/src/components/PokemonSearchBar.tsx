import { StarFilled } from "@carbon/icons-react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import { useGetSearchPokemon } from "../hooks/pokemon/useGetSearchPokemon";
import { useAuth } from "../hooks/useAuth";
import { useLayout } from "../hooks/useLayout";
import { GENERATION } from "../types";

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
  const { isLogged, user } = useAuth();
  const { isMobile } = useLayout();

  const [pokemonNameFilter, setPokemonNameFilter] = useState("");
  const deferredPokemonNameFilter = useDebounce(pokemonNameFilter, 500);

  const {
    data: pokemonList,
    isFetching,
    refetch: refetchPokemonList,
  } = useGetSearchPokemon({
    name: deferredPokemonNameFilter,
    gen: generation,
  });

  useEffect(() => {
    refetchPokemonList();
  }, [deferredPokemonNameFilter, generation, refetchPokemonList]);

  return (
    <div className="flex justify-center items-center flex-row gap-2 sm:gap-4 w-full">
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
        <Tooltip
          color="secondary"
          content="Use your best guess to score a perfect guess"
        >
          <Button
            color="primary"
            className="p-1 w-16 sm:w-36"
            isIconOnly={isMobile}
            isDisabled={gameStatus === "WON" || !user?.numberOfBestGuesses}
            onClick={applyBestGuess}
          >
            {isMobile ? (
              <span className="flex flex-row gap-1 align-center">
                {user?.numberOfBestGuesses} <StarFilled />
              </span>
            ) : (
              `Best Guess (${user?.numberOfBestGuesses})`
            )}
          </Button>
        </Tooltip>
      )}
    </div>
  );
}

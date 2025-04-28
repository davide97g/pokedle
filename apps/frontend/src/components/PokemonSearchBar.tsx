import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import { useGetSearchPokemon } from "../hooks/pokemon/useGetSearchPokemon";
import { useLayout } from "../hooks/useLayout";

export default function PokemonSearchBar({
  gameStatus,
  guessPokemonById,
}: Readonly<{
  gameStatus?: "PLAYING" | "WON";
  guessPokemonById: (pokemonId: number) => void;
}>) {
  const { isMobile } = useLayout();
  const [pokemonNameFilter, setPokemonNameFilter] = useState("");
  const deferredPokemonNameFilter = useDebounce(pokemonNameFilter, 500);

  const {
    data: pokemonList,
    isFetching,
    refetch: refetchPokemonList,
  } = useGetSearchPokemon({
    name: deferredPokemonNameFilter,
  });

  useEffect(() => {
    refetchPokemonList();
  }, [deferredPokemonNameFilter, refetchPokemonList]);

  return (
    <div className="flex justify-center items-center flex-row gap-2 sm:gap-4 w-full">
      <Autocomplete
        size="sm"
        isDisabled={gameStatus === "WON"}
        defaultItems={pokemonList ?? []}
        variant={isMobile ? "flat" : "underlined"}
        label="Search a pokemon"
        labelPlacement="inside"
        className="md:max-w-[300px] autocomplete p-4"
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
    </div>
  );
}

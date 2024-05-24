import { StarFilled } from "@carbon/icons-react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
} from "@nextui-org/react";
import { PokemonSummary } from "../../../types/pokemon.model";
import { useUser } from "../hooks/useUser";

export default function PokemonSearchBar({
  pokemonList,
  gameStatus,
  guessPokemonById,
  applyBestGuess,
}: Readonly<{
  pokemonList: PokemonSummary[];
  gameStatus: "PLAYING" | "WON";
  guessPokemonById: (pokemonId: number) => void;
  applyBestGuess: () => void;
}>) {
  const { isPro, isAdmin } = useUser();
  return (
    <div className="flex justify-center items-center flex-row gap-4  sm:gap-12 w-full">
      {pokemonList.length > 0 && (
        <Autocomplete
          size="sm"
          isDisabled={gameStatus === "WON"}
          defaultItems={pokemonList}
          variant="bordered"
          label="Choose a pokemon"
          labelPlacement="inside"
          className="max-w-[250px] autocomplete"
          onSelectionChange={(pokemonId) => {
            if (pokemonId) guessPokemonById(Number(pokemonId));
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
                  size="md"
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
      {(isAdmin || isPro) && (
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

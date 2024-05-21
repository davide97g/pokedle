import { StarFilled } from "@carbon/icons-react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
} from "@nextui-org/react";
import { PokemonSummary } from "../../../types/pokemon.model";

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
  return (
    <div className="flex justify-center items-center flex-row gap-12 w-full">
      {pokemonList.length > 0 && (
        <Autocomplete
          isDisabled={gameStatus === "WON"}
          defaultItems={pokemonList}
          variant="bordered"
          label="Choose a pokemon"
          labelPlacement="inside"
          className="max-w-xs autocomplete"
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
      <Button
        color="primary"
        isDisabled={gameStatus === "WON"}
        onClick={applyBestGuess}
        startContent={<StarFilled />}
      >
        Best Guess
      </Button>
    </div>
  );
}

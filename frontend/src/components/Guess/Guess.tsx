import {
  Button,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { PokemonSummary } from "../../../../types/pokemon.model";

export default function Guess({
  pokemonToGuess,
}: Readonly<{
  pokemonToGuess: PokemonSummary | undefined;
}>) {
  const isMobile = window.innerWidth < 640;
  if (!pokemonToGuess) return null;
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Popover showArrow offset={10} placement="bottom" backdrop="blur">
        <PopoverTrigger>
          <Button color="danger" variant="flat" className="capitalize">
            Show Guess
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Image
            width={isMobile ? 50 : 100}
            alt="Card background"
            className="object-cover rounded-xl"
            src={pokemonToGuess?.image}
          />
          <div className="flex flex-row justify-between w-full items-center p-2 gap-2">
            <span className="text-small text-gray-400 capitalize">
              {pokemonToGuess.name}
            </span>
            <span className="text-xs text-gray-400">#{pokemonToGuess.id}</span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

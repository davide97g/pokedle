import { Card, Switch, Image } from "@nextui-org/react";
import { PokemonSummary } from "../../../types/pokemon.model";

export default function Guess({
  showGoal,
  setShowGoal,
  pokemonToGuess,
}: Readonly<{
  showGoal: boolean;
  setShowGoal: (value: boolean) => void;
  pokemonToGuess: PokemonSummary | undefined;
}>) {
  const isMobile = window.innerWidth < 640;
  return (
    <div
      style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
      }}
      className="flex flex-col gap-4 items-end"
    >
      <Switch size="sm" isSelected={showGoal} onValueChange={setShowGoal}>
        Guess
      </Switch>
      {showGoal && pokemonToGuess && (
        <Card>
          <Image
            width={isMobile ? 50 : 100}
            alt="Card background"
            className="object-cover rounded-xl"
            src={pokemonToGuess?.image}
          />
          <div className="flex flex-row justify-between w-full items-center p-2">
            <span className="text-small text-gray-400 capitalize">
              {pokemonToGuess.name}
            </span>
            <span className="text-xs text-gray-400">#{pokemonToGuess.id}</span>
          </div>
        </Card>
      )}
    </div>
  );
}

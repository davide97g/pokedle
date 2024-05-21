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
  );
}

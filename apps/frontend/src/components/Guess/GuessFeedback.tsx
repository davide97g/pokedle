import { Card, CardBody, Image, Tooltip } from "@nextui-org/react";

import { PokemonValidationGuess } from "@pokedle/types";
import { GuessFeatureCard } from "./GuessFeatureCard";

export function GuessFeedback({
  guess,
  isNew = false,
}: {
  guess: PokemonValidationGuess;
  isNew?: boolean;
}) {
  const TIMEOUTS = [0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
    isNew ? -0.5 : i * 0.75
  );
  if (!guess?.id) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Card>
        <CardBody
          className={`overflow-visible w-full h-full absolute bg-black/50 rounded-xl`}
          style={{
            border: `2px solid white`,
            opacity: 0.5,
          }}
        />
        <CardBody className={`overflow-visible w-24`}>
          <Tooltip
            showArrow
            content={guess.name + " #" + guess.id}
            className="text-gray-600 capitalize"
          >
            <Image
              alt="Card background"
              className="object-cover rounded-xl cursor-pointer"
              src={guess?.image}
              width={150}
              onClick={() =>
                window.open(`https://www.pokemon.com/us/pokedex/${guess.id}`)
              }
            />
          </Tooltip>
        </CardBody>
      </Card>
      <GuessFeatureCard
        timeout={TIMEOUTS[0]}
        valid={guess.type1.valid}
        value={guess.type1.value}
      />
      <GuessFeatureCard
        timeout={TIMEOUTS[1]}
        valid={guess.type2.valid}
        value={guess.type2.value}
      />
      <GuessFeatureCard
        timeout={TIMEOUTS[2]}
        valid={guess.habitat.valid}
        value={guess.habitat.value}
      />
      <GuessFeatureCard
        timeout={TIMEOUTS[3]}
        valid={guess.color.valid}
        value={guess.color.value}
      />

      <GuessFeatureCard
        timeout={TIMEOUTS[4]}
        valid={guess.evolutionStage.comparison === "equal"}
        value={String(guess.evolutionStage.value)}
        comparison={guess.evolutionStage.comparison}
      />
      <GuessFeatureCard
        timeout={TIMEOUTS[5]}
        valid={guess.height.comparison === "equal"}
        value={String(Number(guess.height.value) / 10) + "m"}
        comparison={guess.height.comparison}
      />
      <GuessFeatureCard
        timeout={TIMEOUTS[6]}
        valid={guess.weight.comparison === "equal"}
        value={String(Number(guess.weight.value) / 10) + "kg"}
        comparison={guess.weight.comparison}
      />
      <GuessFeatureCard
        timeout={TIMEOUTS[7]}
        valid={guess.generation.comparison === "equal"}
        value={String(guess.generation.value)}
        comparison={guess.generation.comparison}
      />
    </div>
  );
}

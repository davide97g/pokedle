import { Card, CardBody, Image, Tooltip } from "@nextui-org/react";
import {
  PokemonSummary,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { ComparisonIcon } from "./ComparisonIcon";

export const GuessFeedback = ({
  guess,
  pokemon,
}: {
  guess: PokemonValidationGuess;
  pokemon?: PokemonSummary;
}) => {
  if (!pokemon) return null;
  return (
    <div className="flex flex-row gap-2">
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
            content={pokemon.name}
            className="text-gray-600 capitalize"
          >
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src={pokemon?.image}
              width={150}
            />
          </Tooltip>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.type1.valid ? "bg-emerald-500" : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.type1.value}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.type2.valid ? "bg-emerald-500" : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.type2.value}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.habitat.valid ? "bg-emerald-500" : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.habitat.value}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.color.valid ? "bg-emerald-500" : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.color.value}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.evolutionStage.comparison === "equal"
              ? "bg-emerald-500"
              : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.evolutionStage.value}</p>
        </CardBody>
        <ComparisonIcon comparison={guess.evolutionStage.comparison} />
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.height.comparison === "equal"
              ? "bg-emerald-500"
              : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="text-small">{Number(guess.height.value) / 10}m</p>
          <ComparisonIcon comparison={guess.height.comparison} />
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.weight.comparison === "equal"
              ? "bg-emerald-500"
              : "bg-rose-800"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">
            {Number(guess.weight.value) / 10}kg
          </p>
          <ComparisonIcon comparison={guess.weight.comparison} />
        </CardBody>
      </Card>
    </div>
  );
};

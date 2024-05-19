import { Card, CardBody, Image } from "@nextui-org/react";
import {
  PokemonModel,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";

export const GuessFeedback = ({
  guess,
  pokemon,
}: {
  guess: PokemonValidationGuess;
  pokemon?: PokemonModel;
}) => {
  if (!pokemon) return null;
  return (
    <div className="flex flex-row gap-2">
      <Card>
        <CardBody className="overflow-visible w-24">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={pokemon?.sprite}
            width={150}
            height={150}
          />
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.type1.valid ? "bg-emerald-600" : "bg-rose-700"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.type1.value}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.type2.valid ? "bg-emerald-600" : "bg-rose-700"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.type2.value}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.habitat.valid ? "bg-emerald-600" : "bg-rose-700"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.habitat.value}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.color.valid ? "bg-emerald-600" : "bg-rose-700"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.color.value}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.evolutionStage.comparison === "equal"
              ? "bg-emerald-600"
              : "bg-rose-700"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">{guess.evolutionStage.value}</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.height.comparison === "equal"
              ? "bg-emerald-600"
              : "bg-rose-700"
          }  text-center flex justify-center`}
        >
          <p className="text-small">{guess.height.value}m</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody
          className={`overflow-visible w-24 ${
            guess.weight.comparison === "equal"
              ? "bg-emerald-600"
              : "bg-rose-700"
          }  text-center flex justify-center`}
        >
          <p className="text-small capitalize">
            {Number(guess.weight.value) / 10}kg
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

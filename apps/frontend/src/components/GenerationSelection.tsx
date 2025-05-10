import { Information } from "@carbon/icons-react";
import { Slider } from "@heroui/slider";
import { Tooltip } from "@heroui/tooltip";
import { useAuth } from "../context/AuthProvider";

const firstPokemonIdForGeneration = [1, 152, 252, 387, 494, 650, 722, 810, 906];
const regionForGeneration = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Kalos",
  "Alola",
  "Galar",
  "Paldea",
];

function Message({
  children,
  userNeedsToLogin,
  alreadyGuessed,
}: {
  children: React.ReactNode;
  userNeedsToLogin: boolean;
  alreadyGuessed: boolean;
}) {
  let messageTooltip =
    "Select how many generations you want to play against by sliding the pokemon starter.";

  if (userNeedsToLogin)
    messageTooltip =
      "You need to login to change the generation. Please login to your account.";
  if (alreadyGuessed)
    messageTooltip =
      "You already guessed a pokemon, please reset the game to change the generation.";

  return (
    <label className="text-medium flex gap-2 items-center">
      {children}
      <Tooltip
        className="w-[200px] px-1.5 text-tiny text-default-600 rounded-small"
        content={messageTooltip}
        placement="right"
      >
        <Information className="transition-opacity opacity-80 hover:opacity-100" />
      </Tooltip>
    </label>
  );
}

export function GenerationSelection({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const { user } = useAuth();

  const userNeedsToLogin = !user;
  const alreadyGuessed = disabled;

  return (
    <div className="flex flex-col items-center gap-2 min-w-[400px]">
      <Message userNeedsToLogin={!user} alreadyGuessed={disabled}>
        <p className="md:text-md text-xs text-white/50 flex justify-end transition-opacity opacity-80 hover:opacity-100">
          Currently playing with generation {value}
        </p>
      </Message>
      <Slider
        color="foreground"
        label="Generation"
        isDisabled={userNeedsToLogin || alreadyGuessed}
        marks={
          Array.from({ length: 9 }, (_, i) => ({
            value: i + 1,
          })) as { value: number; label: string }[]
        }
        classNames={{
          labelWrapper: "mb-5",
        }}
        renderThumb={({ ...props }) => (
          <div
            {...props}
            className="group top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing flex"
          >
            <img
              className="w-16 h-16 grow-1 shrink-0"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                firstPokemonIdForGeneration[value - 1]
              }.png`}
              alt={`Pokemon ${firstPokemonIdForGeneration[value - 1]}`}
            />
          </div>
        )}
        minValue={1}
        maxValue={9}
        step={1}
        renderLabel={({ children, ...props }) => (
          <label {...props} className="text-medium flex gap-2 items-center">
            {children}
            <Tooltip
              className="w-[200px] px-1.5 text-tiny text-default-600 rounded-small"
              content="Select how many generations you want to play against."
              placement="right"
            >
              <span className="transition-opacity opacity-80 hover:opacity-100">
                <Information />
              </span>
            </Tooltip>
          </label>
        )}
        renderValue={({ children, ...props }) => (
          <span {...props} className="text-medium flex gap-2 items-center">
            <span className="text-default-600 font-bold">
              {"#"}
              {children} {regionForGeneration[value - 1]}
            </span>
            <Tooltip
              className="w-[200px] px-1.5 text-tiny text-default-600 rounded-small"
              content="The region of the selected generation."
              placement="right"
            >
              <span className="transition-opacity opacity-80 hover:opacity-100">
                <Information />
              </span>
            </Tooltip>
          </span>
        )}
        size="lg"
        value={value}
        onChange={(v) => {
          console.log("GEN", v);
          onChange(v as number);
        }}
      />
    </div>
  );
}

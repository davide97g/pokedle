import { Chip, Tooltip } from "@nextui-org/react";
import { useAuth } from "../hooks/useAuth";

export default function Stats() {
  const { user } = useAuth();
  if (!user) return null;
  const { stats } = user;

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <div className="flex flex-col items-center gap-10 w-full">
        <h1 className="text-xl">Stats</h1>
        <div className="flex flex-col justify-start align-start gap-5 w-full">
          <Tooltip
            color="foreground"
            content="Best day streak of correct guesses"
          >
            <Chip variant="flat" className="cursor-pointer text-xs sm:text-sm">
              Day Streak: {stats?.dayStreak ?? 0}
            </Chip>
          </Tooltip>
          <Tooltip color="foreground" content="Total correct guesses">
            <Chip variant="flat" className="cursor-pointer text-xs sm:text-sm">
              Total Games: {stats?.totalGames ?? 0}
            </Chip>
          </Tooltip>
          <Tooltip color="foreground" content="Total correct guesses">
            <Chip variant="flat" className="cursor-pointer text-xs sm:text-sm">
              Total Guesses: {stats?.totalGuesses ?? 0}
            </Chip>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

import {
  Avatar,
  Card,
  CardBody,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useDailyUserStats } from "../../hooks/stats/useDailyUserStats";
import dayjs from "dayjs";

export default function TopPlayers() {
  const { usersDailyGuessInfo } = useDailyUserStats();
  return (
    <Card>
      <CardBody>
        <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
          <Listbox
            topContent={
              <div className="flex justify-between items-center">
                <span className="text-md font-semibold">Top Players</span>
                <span className="text-xs sm:text-sm text-default-400">
                  {dayjs().format("YYYY-MM-DD")}{" "}
                </span>
              </div>
            }
            items={usersDailyGuessInfo}
            variant="flat"
          >
            {(item) => (
              <ListboxItem
                key={item.uid}
                textValue={item.dailyGuessInfo.displayName}
              >
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={item.dailyGuessInfo.displayName}
                    className="flex-shrink-0"
                    size="sm"
                    src={item.dailyGuessInfo.photoURL}
                  />
                  <div className="flex flex-col">
                    <span className="text-small">
                      {item.dailyGuessInfo.displayName}
                    </span>
                    <span className="text-tiny text-default-400 flex w-full justify-between items-center gap-1">
                      #{item.dailyGuessInfo.order}{" "}
                      {dayjs(item.dailyGuessInfo.timestamp).format("HH:mm")}
                    </span>
                  </div>
                </div>
              </ListboxItem>
            )}
          </Listbox>
        </div>
      </CardBody>
    </Card>
  );
}

import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { User } from "@heroui/user";
import { PublicLeaderboardItem } from "@pokedle/types";
import { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useStatsGetPublicLeaderboard } from "../../hooks/stats/useStatsGetPublicLeaderboard";

export const columns = [
  { name: "USER", uid: "user" },
  { name: "BEST STREAK", uid: "streak" },
  { name: "AVERAGE GUESSES", uid: "guesses" },
  { name: "TOTAL GAMES", uid: "games" },
];

type Column = "user" | "streak" | "guesses" | "games";

export function PublicLeaderboard() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const publicLeaderboard = useStatsGetPublicLeaderboard(page);
  const renderCell = useCallback(
    (statItem: PublicLeaderboardItem, columnKey: Column) => {
      switch (columnKey) {
        case "user":
          return (
            <User
              avatarProps={{ radius: "lg", src: statItem.user.image }}
              description={statItem.user.name}
              name={statItem.user.name}
              className={
                statItem.user.id === user?.uid
                  ? "border-fuchsia-400 border-2 rounded-lg p-2"
                  : ""
              }
            >
              {statItem.user.name}
            </User>
          );
        case "streak":
          return (
            <div className="flex flex-row items-center gap-2">
              <p className="text-bold text-sm capitalize">
                {statItem.bestStreak}
              </p>
            </div>
          );
        case "guesses":
          return (
            <div className="flex flex-row items-center gap-2">
              <p className="text-bold text-sm capitalize">
                {statItem.totalGuesses / statItem.totalGames}
              </p>
            </div>
          );
        case "games":
          return (
            <div className="flex flex-row items-center gap-2">
              <p className="text-bold text-sm capitalize">
                {statItem.totalGames}
              </p>
            </div>
          );
      }
    },
    []
  );

  return (
    <Table
      aria-label="Example table with custom cells"
      bottomContent={
        publicLeaderboard.data?.currentPage ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={publicLeaderboard.data?.items.length ?? 0}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={publicLeaderboard.data?.items ?? []}>
        {(item) => (
          <TableRow key={item.user.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as Column)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

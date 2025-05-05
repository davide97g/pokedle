import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { DailyUserStatsResponse } from "@pokedle/types";
import { useCallback } from "react";
import { useStatsGetUserStats } from "../../hooks/stats/useStatsGetUserStats";
import { Loader } from "../shared/loader/Loader";

const columns = [
  { name: "DATE", uid: "date" },
  { name: "POKEMON", uid: "pokemon" },
  { name: "GUESSES", uid: "guesses" },
];

type Column = "date" | "pokemon" | "guesses";

export function UserStatsHistory() {
  const userStats = useStatsGetUserStats();

  const renderCell = useCallback(
    (statItem: DailyUserStatsResponse, columnKey: Column) => {
      switch (columnKey) {
        case "date":
          return (
            <p className="text-bold text-sm capitalize">
              {new Date(statItem.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          );
        case "pokemon":
          return (
            <div className="flex flex-row items-center gap-2">
              <img
                src={statItem.pokemon.image}
                alt={statItem.pokemon.name}
                className="w-8 h-8"
              />
              <p className="text-bold text-sm capitalize">
                {statItem.pokemon.name}
              </p>
            </div>
          );
        case "guesses":
          return (
            <div className="flex flex-row items-center gap-2">
              <p className="text-bold text-sm capitalize">{statItem.guesses}</p>
            </div>
          );
      }
    },
    []
  );

  return userStats?.isLoading ? (
    <Loader />
  ) : (
    <Table aria-label="Example table with custom cells">
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
      <TableBody items={userStats.data ?? []}>
        {(item) => (
          <TableRow key={item.date}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as Column)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

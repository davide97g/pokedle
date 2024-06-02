import { useContext } from "react";
import { StatusContext } from "../context/StatusProvider";

export function useStatus() {
  return useContext(StatusContext);
}

import { useContext } from "react";
import { LayoutContext } from "../context/LayoutProvider";

export function useLayout() {
  return useContext(LayoutContext);
}

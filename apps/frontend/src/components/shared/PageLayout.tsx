import { ReactNode } from "react";
import Navbar from "./Navbar";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

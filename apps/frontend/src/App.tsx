import { Route, Routes } from "react-router-dom";
import { LayoutProvider } from "./context/LayoutProvider";
import { StatusProvider } from "./context/StatusProvider";
import About from "./pages/About";
import Player from "./pages/Player";

export default function App() {
  return (
    <main className="purple-dark w-screen h-screen text-foreground bg-background text-center items-center justify-start sm:gap-10 gap-4 flex flex-col overflow-x-auto sm:overflow-x-auto pb-5">
      <LayoutProvider>
        <StatusProvider>
          <Routes>
            <Route element={<Player />} path="/" />
            <Route element={<About />} path="/about" />
          </Routes>
        </StatusProvider>
      </LayoutProvider>
    </main>
  );
}

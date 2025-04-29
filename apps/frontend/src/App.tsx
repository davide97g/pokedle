import { Route, Routes } from "react-router-dom";
import ServerReady from "./components/ServerReady";
import { LayoutProvider } from "./context/LayoutProvider";
import { StatusProvider } from "./context/StatusProvider";
import About from "./pages/About";
import Player from "./pages/Player";

export default function App() {
  return (
    <main className="container purple-dark w-screen h-screen text-foreground bg-background text-center items-center justify-start sm:gap-10 gap-4 flex flex-col overflow-x-auto sm:overflow-x-auto pb-5">
      <ServerReady>
        <LayoutProvider>
          <StatusProvider>
            <Routes>
              <Route element={<Player />} path="/" />
              <Route element={<About />} path="/about" />
            </Routes>
          </StatusProvider>
        </LayoutProvider>
      </ServerReady>
    </main>
  );
}

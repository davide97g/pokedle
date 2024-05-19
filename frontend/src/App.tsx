import { Player } from "./pages/Player";
import { Solver } from "./pages/Solver";

function App() {
  const url = window.location.href;
  if (url.includes("solver")) {
    return <Solver />;
  }

  return <Player />;
}

export default App;

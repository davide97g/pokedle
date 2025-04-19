import { RouterProvider } from "react-router-dom";

import { LayoutProvider } from "./context/LayoutProvider";
import { StatusProvider } from "./context/StatusProvider";
import { router } from "./router";

export default function App() {
  return (
    <main className="purple-dark w-screen h-screen text-foreground bg-background text-center items-center justify-start sm:gap-10 gap-4 flex flex-col overflow-x-auto sm:overflow-x-auto pb-5">
      <LayoutProvider>
        <StatusProvider>
          <RouterProvider router={router} />
        </StatusProvider>
      </LayoutProvider>
      <script
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id="pokedle"
        data-description="Support me on Buy me a coffee!"
        data-message=""
        data-color="#3B096C"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"
      ></script>
    </main>
  );
}

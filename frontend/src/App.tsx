import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import { router } from "./router";

export default function App() {
  return (
    <main className="purple-dark w-screen h-screen text-foreground bg-background text-center items-center justify-start sm:gap-10 gap-4 flex flex-col overflow-x-auto sm:overflow-x-auto pb-5">
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </main>
  );
}

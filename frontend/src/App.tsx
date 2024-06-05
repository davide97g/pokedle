import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import { router } from "./router";
import { LayoutProvider } from "./context/LayoutProvider";
import { StatusProvider } from "./context/StatusProvider";
import Header from "./components/Header";

export default function App() {
  return (
    <main className="purple-dark w-screen h-screen text-foreground bg-background text-center items-center justify-start sm:gap-10 gap-4 flex flex-col overflow-x-auto sm:overflow-x-auto pb-5">
      <LayoutProvider>
        <AuthProvider>
          <StatusProvider>
            <Header />
            <RouterProvider router={router}></RouterProvider>
          </StatusProvider>
        </AuthProvider>
      </LayoutProvider>
    </main>
  );
}

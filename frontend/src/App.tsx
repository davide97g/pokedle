import { RouterProvider } from "react-router-dom";
import { AuthContext } from "./context/AuthProvider";
import { router } from "./router";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, setUser } = useAuth();
  return (
    <main className="purple-dark w-screen h-screen text-foreground bg-background text-center items-center justify-start sm:gap-10 gap-4 flex flex-col overflow-x-auto sm:overflow-x-auto pb-5">
      <AuthContext.Provider value={{ user, setUser }}>
        <RouterProvider router={router}></RouterProvider>
      </AuthContext.Provider>
    </main>
  );
}

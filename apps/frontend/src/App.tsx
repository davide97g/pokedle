import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AuthenticatedPage from "./components/AuthenticatedPage";
import TopNavbar from "./components/Navbar";
import ServerReady from "./components/ServerReady";
import { AuthProvider } from "./context/AuthProvider";
import { LayoutProvider } from "./context/LayoutProvider";
import { StatusProvider } from "./context/StatusProvider";

const Player = lazy(() => import("./pages/Player"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PersonalArea = lazy(() => import("./pages/PersonalArea"));

export default function App() {
  return (
    <main className="container purple-dark w-screen h-screen text-foreground bg-background text-center items-center justify-start sm:gap-10 gap-4 flex flex-col overflow-x-auto sm:overflow-x-auto pb-5">
      <ServerReady>
        <AuthProvider>
          <LayoutProvider>
            <StatusProvider>
              <TopNavbar />
              <Routes>
                <Route element={<Player />} path="/" />
                <Route element={<About />} path="/about" />
                <Route element={<Login />} path="/login" />
                <Route element={<Register />} path="/register" />
                <Route
                  element={
                    <AuthenticatedPage>
                      <PersonalArea />
                    </AuthenticatedPage>
                  }
                  path="/me"
                />
              </Routes>
            </StatusProvider>
          </LayoutProvider>
        </AuthProvider>
      </ServerReady>
    </main>
  );
}

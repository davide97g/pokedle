import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import AuthenticatedPage from "./components/shared/AuthenticatedPage";
import { PageLayout } from "./components/shared/PageLayout";
import ServerReady from "./components/shared/ServerReady";
import { AuthProvider } from "./context/AuthProvider";
import { LayoutProvider } from "./context/LayoutProvider";
import { StatusProvider } from "./context/StatusProvider";

const Player = lazy(() => import("./pages/Player"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PersonalArea = lazy(() => import("./pages/PersonalArea"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));

export default function App() {
  return (
    <main className="container purple-dark w-screen h-screen text-foreground bg-background text-center items-center justify-start sm:gap-10 gap-4 flex flex-col overflow-x-auto sm:overflow-x-auto pb-5">
      <ServerReady>
        <AuthProvider>
          <LayoutProvider>
            <StatusProvider>
              <Suspense>
                <Routes>
                  <Route
                    element={
                      <PageLayout>
                        <Player />
                      </PageLayout>
                    }
                    path="/"
                  />
                  <Route
                    element={
                      <PageLayout>
                        <About />
                      </PageLayout>
                    }
                    path="/about"
                  />
                  <Route
                    element={
                      <PageLayout>
                        <Login />
                      </PageLayout>
                    }
                    path="/login"
                  />
                  <Route
                    element={
                      <PageLayout>
                        <Register />
                      </PageLayout>
                    }
                    path="/register"
                  />
                  <Route
                    element={
                      <PageLayout>
                        <Leaderboard />
                      </PageLayout>
                    }
                    path="/leaderboard"
                  />
                  <Route
                    element={
                      <AuthenticatedPage>
                        <PageLayout>
                          <PersonalArea />
                        </PageLayout>
                      </AuthenticatedPage>
                    }
                    path="/me"
                  />
                </Routes>
              </Suspense>
            </StatusProvider>
          </LayoutProvider>
        </AuthProvider>
      </ServerReady>
    </main>
  );
}

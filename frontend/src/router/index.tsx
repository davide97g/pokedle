import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const Player = lazy(() => import("../pages/Player"));
const Login = lazy(() => import("../pages/Login"));
const About = lazy(() => import("../pages/About"));
const PersonalArea = lazy(() => import("../pages/PersonalArea"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense>
        <Player />
      </Suspense>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/login",
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense>
        <About />
      </Suspense>
    ),
  },
  {
    path: "/me",
    element: (
      <Suspense>
        <PersonalArea />
      </Suspense>
    ),
  },
]);

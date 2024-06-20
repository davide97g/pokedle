import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const Player = lazy(() => import("../pages/Player"));
const CustomGame = lazy(() => import("../pages/CustomGame"));
const Login = lazy(() => import("../pages/Login"));
const About = lazy(() => import("../pages/About"));
const PersonalArea = lazy(() => import("../pages/PersonalArea"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Orders = lazy(() => import("../pages/Orders"));
const Rankings = lazy(() => import("../pages/Rankings"));

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
    path: "/custom",
    element: (
      <Suspense>
        <CustomGame />
      </Suspense>
    ),
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
  {
    path: "/checkout",
    element: (
      <Suspense>
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: "/orders",
    element: (
      <Suspense>
        <Orders />
      </Suspense>
    ),
  },
  {
    path: "/rankings",
    element: (
      <Suspense>
        <Rankings />
      </Suspense>
    ),
  },
]);

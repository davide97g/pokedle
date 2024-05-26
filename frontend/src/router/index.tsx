import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const Player = lazy(() => import("../pages/Player"));
const Login = lazy(() => import("../pages/Login"));
const Admin = lazy(() => import("../pages/Admin"));

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
    path: "/admin",
    element: (
      <Suspense>
        <Admin />
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
]);

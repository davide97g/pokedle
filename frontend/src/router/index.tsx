import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const Player = lazy(() => import("../pages/Player"));
const About = lazy(() => import("../pages/About"));

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
    path: "/about",
    element: (
      <Suspense>
        <About />
      </Suspense>
    ),
  },
]);

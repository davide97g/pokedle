import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="purple-dark w-screen h-screen text-foreground bg-background text-center justify-center items-center justify-center gap-10 flex flex-col">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>
);

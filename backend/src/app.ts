import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { addAdminRoutes } from "./api/admin";
import { addProRoutes } from "./api/pro";
import { addPublicRoutes } from "./api/public";
import { initializeFirebaseApp } from "./config/firebase";
import { scheduleDailyUpdate } from "./features/update";
import { getTodayPokemonList } from "./features/player/manager";

dotenv.config();

initializeFirebaseApp();

scheduleDailyUpdate();

const app = express();

const allowedOrigins = [
  "http://localhost:8080",
  "https://pokedle97.vercel.app",
  "https://pokedle.online",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

const port = process.env.PORT;

// **** PUBLIC ****
addPublicRoutes(app);

// **** PRO USERS ****
addProRoutes(app);

// **** ADMIN ****
addAdminRoutes(app);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  getTodayPokemonList();
});

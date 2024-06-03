import nodeCron from "node-cron";
import * as cron from "cron";
import { updatePokemonToGuess } from "../player/manager";
import { config } from "dotenv";
config();

const BACKEND_URL =
  process.env.MODE === "DEVELOPMENT"
    ? "https://server.pokedle.online/"
    : `http://localhost:${process.env.PORT ?? 3000}`;

export const scheduleDailyUpdate = () => {
  // Run every day at midnight
  console.info("[update]: Scheduling daily update...");
  nodeCron.schedule("0 0 * * *", async () => {
    await updatePokemonToGuess();
    console.info("[update]: Daily update completed!");
  });
};

export const keepAliveJob = new cron.CronJob("*/14 * * * *", async () => {
  console.log("Keep alive");
  await fetch(BACKEND_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) console.log("Server Restarted");
    else console.log(`Server Restart Failed ${res.status}`);
  });
});

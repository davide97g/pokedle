import cron from "node-cron";
import { updatePokemonToGuess } from "../player/manager";

export const scheduleDailyUpdate = () => {
  // Run every day at midnight
  console.info("[update]: Scheduling daily update...");
  cron.schedule("0 0 * * *", async () => {
    await updatePokemonToGuess();
    console.info("[update]: Daily update completed!");
  });
};

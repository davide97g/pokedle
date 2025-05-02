import { type Express } from "express";
import { isLogged } from "../middlewares/authentication";
import { getUserStats } from "../services/stats.service";
import { getUserInfoFromToken } from "../utils/tokenInfo";

export const createStatsController = (app: Express) => {
  app.get("/stats", (req, res) => {
    try {
      res.status(200).send({ stats: [] });
    } catch (error) {
      console.error("Error gettings stats", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.get("/stats/history", isLogged, async (req, res) => {
    try {
      const user = await getUserInfoFromToken(req);
      if (!user) {
        res.status(401).send("Unauthorized");
        return;
      }
      const userId = user.uid;
      if (!userId) {
        res.status(401).send("Unauthorized");
        return;
      }
      const stats = await getUserStats(userId);
      res.status(200).send(stats);
    } catch (error) {
      console.error("Error gettings private stats", error);
      res.status(500).send("Internal Server Error");
    }
  });
};

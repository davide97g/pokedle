import { type Express } from "express";
import { isLogged } from "../middlewares/authentication";
import { getPublicLeaderboard, getUserStats } from "../services/stats.service";
import { getUserInfoFromToken } from "../utils/tokenInfo";

export const createStatsController = (app: Express) => {
  app.get("/stats", isLogged, async (req, res) => {
    try {
      const sortBy = req.query.sortBy?.toString() || "bestStreak";
      const sortOrder = (req.query.sortOrder?.toString() || "desc") as
        | "desc"
        | "asc";

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 2;
      if (page < 1 || pageSize < 1) {
        res.status(400).send("Invalid page or pageSize");
        return;
      }

      const leaderboard = await getPublicLeaderboard(
        page,
        pageSize,
        sortBy,
        sortOrder
      );
      const paginatedResponse = {
        items: leaderboard,
        currentPage: page,
        pageSize,
      };
      res.status(200).send(paginatedResponse);
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

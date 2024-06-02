import express, { Express, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import {
  getTodayPokemonList,
  updatePokemonToGuess,
} from "../features/player/manager";
import { isAdmin } from "../middleware/isAdmin";

export const addAdminRoutes = (app: Express) => {
  // ? Create admins
  app.post(
    "/create-admin",
    [isAdmin],
    express.json(),
    async (req: Request, res: Response) => {
      // Get the ID token passed.
      const idToken = req.body.idToken;

      // Verify the ID token and decode its payload.
      const claims = await getAuth().verifyIdToken(idToken);
      console.log(claims);

      // Verify user is eligible for additional privileges.
      if (
        typeof claims.email !== "undefined" &&
        typeof claims.email_verified !== "undefined" &&
        claims.email_verified &&
        claims.email === "ghiotto.davidenko@gmail.com"
      ) {
        // Add custom claims for additional privileges.
        await getAuth().setCustomUserClaims(claims.sub, {
          admin: true,
        });

        // Tell client to refresh token on user.
        res.end(
          JSON.stringify({
            status: "success",
          })
        );
      } else {
        // Return nothing.
        res.end(JSON.stringify({ status: "ineligible" }));
      }
    }
  );

  app.post(
    "/new-pokemon",
    [isAdmin],
    express.json(),
    (_: Request, res: Response) => {
      const pokemonDayStats = updatePokemonToGuess();
      res.send({ pokemonDayStats });
    }
  );

  app.post(
    "/day-stats",
    [isAdmin],
    express.json(),
    async (_: Request, res: Response) => {
      const pokemonDayStats = await getTodayPokemonList();
      res.send({
        pokemonDayStats,
      });
    }
  );

  return app;
};

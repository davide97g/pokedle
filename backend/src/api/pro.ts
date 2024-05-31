import express, { Express, Request, Response } from "express";
import { PokemonValidationGuess } from "../../../types/pokemon.model";
import { isPro } from "../middleware/isPro";
import { guessPokemon } from "../features/solver";
import { decrementUserBestGuesses } from "../features/user";
import { getAuth } from "firebase-admin/auth";
import { stripe } from "../config/stripe";
import { addBestGuessToUser } from "../features/payments";
import { GENERATION } from "../../../types/user.types";

const endpointSecret = process.env.STRIPE_CHECKOUT_SIGNING_SECRET;

export const addProRoutes = (app: Express) => {
  app.post(
    "/best-guess/:gen",
    [isPro],
    express.json(),
    async (req: Request, res: Response) => {
      const validationGuessHistory = req.body as PokemonValidationGuess[];
      const gen = req.params.gen as GENERATION;
      const pokemon = guessPokemon(validationGuessHistory, gen);
      const bearerToken = req.header("Authorization");
      if (bearerToken) {
        const claims = await getAuth().verifyIdToken(
          bearerToken?.split("Bearer ")[1]
        );
        const userId = claims.uid;
        if (userId) await decrementUserBestGuesses({ userId });
        res.send({ pokemon });
      } else {
        res.status(401).send({ message: "Unauthorized" });
      }
    }
  );

  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (request, response) => {
      const sig = request.headers["stripe-signature"] as string;

      if (!endpointSecret) {
        response.status(400).send(`Webhook Error: Signing secret not found`);
        return;
      }

      let event;

      try {
        event = stripe?.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
      } catch (err: any) {
        response.status(400).send(`Webhook Error: ${err?.message}`);
        return;
      }

      // Handle the event
      switch (event?.type) {
        case "checkout.session.completed":
          console.info("[Event]: checkout.session.completed");
          await addBestGuessToUser(event.data.object);
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event?.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send();
    }
  );

  return app;
};

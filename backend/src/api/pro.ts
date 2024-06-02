import express, { Express, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import Stripe from "stripe";
import { PokemonValidationGuess } from "../../../types/pokemon.model";
import { GENERATION } from "../../../types/user.types";
import { stripe } from "../config/stripe";
import {
  addBestGuessToUser,
  getCheckoutSessionListItems,
} from "../features/payments";
import { guessPokemon } from "../features/solver";
import { decrementUserBestGuesses } from "../features/user";
import { isPro } from "../middleware/isPro";

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

  app.get(
    "/checkout-session/:id",
    [isPro],
    async (req: Request, res: Response) => {
      const sessionId = req.params.id;
      const lineItems = await getCheckoutSessionListItems(sessionId);
      res.send({ lineItems });
    }
  );

  app.post(
    "/order/history",
    [isPro],
    express.json(),
    async (req: Request, res: Response) => {
      const checkoutSessionIdList = req.body as string[];
      if (!checkoutSessionIdList.length) {
        res.status(400).send({ message: "Missing checkout session IDs" });
        return;
      }

      const history =
        ((await Promise.all(
          checkoutSessionIdList?.map((sessionId) =>
            getCheckoutSessionListItems(sessionId)
          ) ?? []
        ).then((res) => res.filter(Boolean))) as Stripe.Response<
          Stripe.ApiList<Stripe.LineItem>
        >) ?? [];
      res.send({ history });
    }
  );

  return app;
};

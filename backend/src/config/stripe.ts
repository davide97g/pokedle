import { Stripe } from "stripe";
import { config } from "dotenv";
config();

const stripeSecretKey = process.env.STRIPE_API_PRIVATE_KEY;
export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

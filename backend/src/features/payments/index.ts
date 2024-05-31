import Stripe from "stripe";
import { stripe } from "../../config/stripe";
import { addRecordToUserPaymentHistory, incrementUserBestGuess } from "../user";

export const getCheckoutSession = async (id: string) => {
  try {
    const session = await stripe?.checkout.sessions.retrieve(id);
    return session;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCheckoutSessionListItems = async (id: string) => {
  try {
    const lineItems = await stripe?.checkout.sessions.listLineItems(id);
    return lineItems;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addBestGuessToUser = async (
  checkoutSession: Stripe.Checkout.Session
) => {
  const userId = checkoutSession.client_reference_id;
  if (!userId) {
    console.error("No user found");
    return;
  }
  const listLineItems = await getCheckoutSessionListItems(checkoutSession.id);
  if (!listLineItems) {
    console.error("No line items found");
    return;
  }
  const firstItem = listLineItems.data[0];

  if (firstItem.price?.product !== "prod_QCpdgazOa3lEft") {
    console.error("Not the right product");
    return;
  }

  const quantity = (firstItem.quantity ?? 0) * 10;

  if (!quantity) {
    console.error("No quantity found");
    return;
  }

  console.info("Adding best guess to user", userId, quantity, "best guesses");

  // Add best guess to user
  await incrementUserBestGuess({ userId, quantity });
  await addRecordToUserPaymentHistory({
    userId,
    record: {
      amount: quantity,
      product: firstItem.description,
      date: new Date().toISOString(),
    },
  });
};

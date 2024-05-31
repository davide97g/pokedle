import { stripe } from "../../config/stripe";

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

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
//

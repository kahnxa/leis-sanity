import Stripe from "stripe";

/**
 * Initializes and returns the Stripe instance.
 */
const initializeStripe = (): Stripe => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia", // Use the appropriate version
  });
};

export default initializeStripe;

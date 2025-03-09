import { NextApiRequest, NextApiResponse } from "next";
import initializeStripe from "@/lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const stripe = initializeStripe();

    if (req.method === "POST") {
      const { amount } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

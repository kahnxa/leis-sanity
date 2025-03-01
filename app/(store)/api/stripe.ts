// pages/api/stripe.ts (assuming you're using TypeScript)

// Importing the types for req (request) and res (response) from Next.js
import { NextApiRequest, NextApiResponse } from "next"; // These types help TypeScript understand the structure of req and res
import initializeStripe from "@/lib/stripe"; // Importing the function to initialize Stripe from your utils folder

// The handler function for the API route. This will handle incoming requests to /api/stripe
export default async function handler(
  req: NextApiRequest, // `req` is the request object, typed as NextApiRequest
  res: NextApiResponse // `res` is the response object, typed as NextApiResponse
) {
  try {
    // Call the initializeStripe function which returns the Stripe instance
    const stripe = initializeStripe();

    // Check if the request method is POST. Stripe payment intents typically use POST requests.
    if (req.method === "POST") {
      // Destructure the amount from the request body
      const { amount } = req.body; // The `amount` is expected to be sent by the client

      // Create a payment intent on Stripe using the amount and currency (USD in this case)
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // The amount to be charged, typically in cents (e.g., 1000 = $10)
        currency: "usd", // The currency for the payment (USD in this case)
      });

      // Respond with a JSON object containing the client secret, which will be used in the frontend to complete the payment
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } else {
      // If the request method is not POST, respond with a 405 Method Not Allowed status
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error: any) {
    // If there is an error, we catch it here. The error is typed as 'any' to avoid TypeScript issues (we don't know its shape).
    res.status(500).json({ error: error.message }); // Respond with a 500 Internal Server Error and the error message
  }
}

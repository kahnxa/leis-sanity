import { Metadata } from "@/actions/createCheckoutSession";
import initializeStripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateProductStock } from "@/actions/updateProductStock";

export async function POST(req: NextRequest) {
  const stripe = initializeStripe();
  const body = await req.text();
  const headersList = headers();
  const sig = (await headersList).get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No Signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.log("A Stripe webhook secret is not set.");
    return NextResponse.json(
      { error: "Stripe webhook secret is not set" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    // Verify the webhook signature using Stripe's constructEvent method
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: `Webhook error: ${error}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Start transaction if your database supports it
      console.log("Processing order for session ID:", session.id);

      // Create the order in Sanity
      const order = await createOrderInSanity(session, stripe);
      console.log("Order created in Sanity:", order._id);

      // Update product stock levels
      await updateProductStockForOrder(session, stripe);
      console.log("Product stock levels updated successfully");
    } catch (error) {
      console.error("Error processing order:", error);
      return NextResponse.json(
        { error: "Error processing order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function updateProductStockForOrder(
  session: Stripe.Checkout.Session,
  stripe: ReturnType<typeof initializeStripe>
) {
  // Get the line items from the session
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });

  console.log(
    `Processing ${lineItems.data.length} line items for stock update`
  );

  // Update stock for each product
  for (const item of lineItems.data) {
    const product = item.price?.product as Stripe.Product;
    const productId = product?.metadata?.id;
    const quantity = item.quantity || 0;

    if (!productId) {
      console.error(`Missing product ID in metadata for line item`, item);
      continue;
    }

    console.log(
      `Updating stock for product ${productId}, reducing by ${quantity}`
    );

    try {
      const result = await updateProductStock(productId, quantity);
      console.log(`Stock update result for ${productId}:`, result);
    } catch (error) {
      console.error(`Failed to update stock for product ${productId}:`, error);
    }
  }
}

async function createOrderInSanity(
  session: Stripe.Checkout.Session,
  stripe: ReturnType<typeof initializeStripe>
) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as Metadata;

  // Use the stripe instance passed as a parameter
  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {
      expand: ["data.price.product"],
    }
  );

  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  const stripeCustomerId = customer;
  console.log(
    "Creating order in Sanity with Stripe Customer ID:",
    stripeCustomerId
  );

  const existingOrder = await backendClient.fetch(
    `*[_type == "order" && stripeCheckoutSessionId == $sessionId][0]`,
    {
      sessionId: session.id,
    }
  );

  if (existingOrder) {
    console.log("Order already exists for this session:", session.id);
    return existingOrder;
  }

  const order = await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customer,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
  });

  return order;
}

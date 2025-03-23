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
      console.log("Processing order for session ID:", session.id);
      const order = await createOrderInSanity(session, stripe);
      console.log("Order created in Sanity:", order._id);
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
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });

  console.log(
    `Processing ${lineItems.data.length} line items for stock update`
  );

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
  // Updated type casting to match Stripe's actual response structure
  const sessionWithShipping = session as Stripe.Checkout.Session & {
    shipping_details?: {
      address?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
      };
      name?: string;
    };
    customer_details?: {
      name?: string;
      address?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
      };
    };
  };

  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { shipping_details, customer_details } = sessionWithShipping;
  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as Metadata;

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

  const existingOrder = await backendClient.fetch(
    `*[_type == "order" && stripeCheckoutSessionId == $sessionId][0]`,
    { sessionId: session.id }
  );

  if (existingOrder) {
    console.log("Order already exists for this session:", session.id);
    return existingOrder;
  }

  // Updated shipping address processing using shipping_details
  const shippingAddress = shipping_details?.address
    ? {
        name: shipping_details.name || customerName,
        line1: shipping_details.address.line1,
        line2: shipping_details.address.line2 || "",
        city: shipping_details.address.city,
        state: shipping_details.address.state,
        postalCode: shipping_details.address.postal_code,
        country: shipping_details.address.country,
      }
    : null;

  // Debug logging for shipping address
  console.log("Raw shipping details from Stripe:", shipping_details);
  console.log("Processed shipping address:", shippingAddress);

  // Validate required shipping address fields
  if (shippingAddress) {
    if (
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      console.error("Invalid shipping address format:", shippingAddress);
      throw new Error("Missing required shipping address fields");
    }
  }

  const billingAddress = customer_details?.address
    ? {
        name: customer_details.name || customerName,
        line1: customer_details.address.line1,
        line2: customer_details.address.line2 || "",
        city: customer_details.address.city,
        state: customer_details.address.state,
        postalCode: customer_details.address.postal_code,
        country: customer_details.address.country,
      }
    : null;

  const billingAddressSameAsShipping =
    !billingAddress ||
    (shippingAddress &&
      billingAddress.line1 === shippingAddress.line1 &&
      billingAddress.city === shippingAddress.city &&
      billingAddress.postalCode === shippingAddress.postalCode);

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
    ...(shippingAddress && { shippingAddress }),
    billingAddressSameAsShipping,
    ...(!billingAddressSameAsShipping && billingAddress && { billingAddress }),
  });

  return order;
}

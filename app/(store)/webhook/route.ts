import { Metadata } from "@/actions/createCheckoutSession";
import initializeStripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateProductStock } from "@/actions/updateProductStock";
import { sendOrderConfirmation } from "@/actions/sendOrderConfirmation";
import { sendAdminOrderNotification } from "@/actions/sendAdminOrderNotification";

// Add these interfaces near the top of your file or in a separate types file
interface StripeAddress {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  state?: string;
}

interface StripeBillingDetails {
  address?: StripeAddress;
  email?: string;
  name?: string;
  phone?: string;
}

interface StripePaymentMethod {
  id: string;
  billing_details?: StripeBillingDetails;
  // Add other fields you might need
}

// Define a proper type for Sanity order data
interface SanityOrderData {
  _type: string;
  orderNumber: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | Stripe.PaymentIntent | null;
  customerName: string;
  stripeCustomerId: string | Stripe.Customer | Stripe.DeletedCustomer | null;
  clerkUserId?: string;
  email: string;
  currency: string | null;
  amountDiscount: number;
  products: Array<{
    _key: string;
    product: {
      _type: string;
      _ref: string;
    };
    quantity: number;
    unitPrice: number;
    name: string;
  }>;
  totalPrice: number;
  status: string;
  orderDate: string;
  shippingAddress?: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddressSameAsShipping: boolean;
  billingAddress?: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string | undefined;
    country: string | undefined;
  };
  shippingCost: number;
  taxAmount: number;
}

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

      // Add this code to send the email
      console.log("Attempting to send confirmation email to:", order.email);
      try {
        const emailResult = await sendOrderConfirmation(order);
        console.log("Email sending result:", emailResult);
      } catch (emailError) {
        console.error("Email sending failed with error:", emailError);
      }

      // Send notification email to admin
      console.log("Sending admin notification email");
      try {
        const adminEmailResult = await sendAdminOrderNotification(order);
        console.log("Admin notification result:", adminEmailResult);
      } catch (adminEmailError) {
        console.error("Admin notification failed with error:", adminEmailError);
      }
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
  try {
    // Retrieve line items WITH product expansion
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    // Filter items by type
    const productItems = lineItems.data.filter((item) => {
      if (!item.price) return false;
      const product = item.price.product as Stripe.Product;
      // Only keep items that are NOT shipping or tax
      return (
        !product?.name?.includes("Shipping") && !product?.name?.includes("Tax")
      );
    });

    // Find shipping and tax items
    const shippingItem = lineItems.data.find((item) =>
      (item.price?.product as Stripe.Product)?.name?.includes("Shipping")
    );

    const taxItem = lineItems.data.find((item) =>
      (item.price?.product as Stripe.Product)?.name?.includes("Tax")
    );

    // Create product references (only for actual products)
    const sanityProducts = productItems.map((item) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
      },
      quantity: item.quantity || 0,
      unitPrice: (item.price?.unit_amount || 0) / 100,
      name: (item.price?.product as Stripe.Product)?.name || "Unknown Product",
    }));

    // Add shipping and tax info to order document
    const shippingCost = shippingItem
      ? (shippingItem.amount_total || 0) / 100
      : 0;

    const taxAmount = taxItem ? (taxItem.amount_total || 0) / 100 : 0;

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

    const existingOrder = await backendClient.fetch(
      `*[_type == "order" && stripeCheckoutSessionId == $sessionId][0]`,
      { sessionId: session.id }
    );

    if (existingOrder) {
      console.log("Order already exists for this session:", session.id);
      return existingOrder;
    }

    // Debug logging for understanding what Stripe sends
    console.log("Customer details from Stripe:", customer_details);
    console.log("Shipping details from Stripe:", shipping_details);

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

    // Add more debug logging to understand Stripe's data format
    console.log("Raw session object from Stripe:", {
      customer_details: session.customer_details,
      payment_intent: session.payment_intent,
    });

    // Check if there's a billing address toggle setting in the session
    const stripeCheckoutBillingOption = session.custom_fields?.find(
      (field) => field.key === "billing_address_collection_option"
    );

    console.log("Stripe checkout billing option:", stripeCheckoutBillingOption);

    // Explicitly convert to boolean value to avoid any type issues in Sanity
    const billingIsSameAsShipping =
      session.metadata?.billingAddressSameAsShipping === "true";

    // Determine if user entered a separate billing address in Stripe
    let userEnteredDifferentBillingAddress = false;
    let billingAddress = null;

    // Try to detect if user entered a different billing address in Stripe
    if (payment_intent) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          payment_intent as string,
          { expand: ["payment_method"] }
        );

        const paymentMethod =
          paymentIntent.payment_method as StripePaymentMethod;
        const billingDetails = paymentMethod?.billing_details;

        // If user entered complete billing details, they want separate billing
        if (
          billingDetails?.address &&
          billingDetails.address.line1 &&
          billingDetails.address.city
        ) {
          userEnteredDifferentBillingAddress = true;

          billingAddress = {
            name: billingDetails.name || customerName,
            line1: billingDetails.address.line1,
            line2: billingDetails.address.line2 || "",
            city: billingDetails.address.city,
            state: billingDetails.address.state || "",
            postalCode: billingDetails.address.postal_code || "",
            country: billingDetails.address.country || "",
          };
        }
      } catch (error) {
        console.error("Error retrieving payment intent:", error);
      }
    }

    // Final determination - only set this to true if:
    // 1. Our metadata says it's the same AND
    // 2. User didn't enter different billing details in Stripe
    const finalBillingAddressSameAsShipping =
      billingIsSameAsShipping && !userEnteredDifferentBillingAddress;

    console.log(
      "Final billing same as shipping:",
      finalBillingAddressSameAsShipping
    );

    // Create Sanity order with very explicit handling
    const orderData: SanityOrderData = {
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
      billingAddressSameAsShipping: finalBillingAddressSameAsShipping,
      shippingCost: shippingCost,
      taxAmount: taxAmount,
      ...(shippingAddress && { shippingAddress }),
    };

    // ONLY add billingAddress if we're not using shipping address
    if (!finalBillingAddressSameAsShipping && billingAddress) {
      orderData.billingAddress = billingAddress;
    }

    const order = await backendClient.create(orderData);

    return order;
  } catch (error) {
    console.error("Error in createOrderInSanity:", error);
    throw error;
  }
}

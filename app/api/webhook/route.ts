import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/sanity/lib/orders/createOrder";
import { sendOrderConfirmation } from "@/actions/sendOrderConfirmation";

export async function POST(req: Request) {
  console.log("Webhook received");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      console.log("Checkout session completed event received");

      const session = event.data.object as Stripe.Checkout.Session;

      // Extract order data from the session
      const customerEmail = session.customer_details?.email;
      console.log("Customer email from Stripe:", customerEmail);

      const orderData = {
        orderNumber: session.metadata?.orderNumber,
        customerName: session.metadata?.customerName,
        email: customerEmail,
        products:
          session.line_items?.data.map((item) => {
            const productId =
              typeof item.price?.product === "object" &&
              item.price?.product !== null &&
              "metadata" in item.price.product
                ? item.price.product.metadata?.id
                : undefined;

            return {
              id: productId,
              productId: productId,
              name: item.description,
              quantity: item.quantity,
              unitPrice: item.amount_total / 100 / (item.quantity || 1),
            };
          }) || [],
        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
        shippingCost: session.shipping_cost?.amount_total
          ? session.shipping_cost.amount_total / 100
          : 0,
        taxAmount: session.total_details?.amount_tax
          ? session.total_details.amount_tax / 100
          : 0,
        shippingAddress: session.shipping_details?.address
          ? {
              name: session.shipping_details.name,
              line1: session.shipping_details.address.line1,
              line2: session.shipping_details.address.line2,
              city: session.shipping_details.address.city,
              state: session.shipping_details.address.state,
              postalCode: session.shipping_details.address.postal_code,
              country: session.shipping_details.address.country,
            }
          : null,
        clerkUserId: session.metadata?.clerkUserId,
        currency: session.currency,
      };

      console.log("Order data prepared:", JSON.stringify(orderData));

      // Create the order with the extracted data
      const order = await createOrder(orderData);

      console.log("Order created:", order._id);

      // Send confirmation email
      if (order) {
        console.log("Attempting to send confirmation email to:", order.email);
        try {
          const emailResult = await sendOrderConfirmation(order);
          console.log("Email sending result:", emailResult);
        } catch (emailError) {
          console.error("Email sending failed with error:", emailError);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}

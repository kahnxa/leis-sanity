import { NextResponse } from "next/server";
import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";
import { sendOrderConfirmation } from "@/actions/sendOrderConfirmation";

export async function POST(req: Request) {
  try {
    const { userId, orderNumber } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "No user ID provided" },
        { status: 400 }
      );
    }

    // Get all orders for the user
    const orders = await getMyOrders(userId);

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    // If orderNumber is provided, find that specific order
    let orderToEmail = orderNumber
      ? orders.find((order) => order.orderNumber === orderNumber)
      : orders[0]; // Otherwise use the most recent order

    if (!orderToEmail) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log(
      "Attempting to send confirmation email to:",
      orderToEmail.email
    );
    const emailResult = await sendOrderConfirmation(orderToEmail);

    return NextResponse.json({ success: true, emailResult });
  } catch (error) {
    console.error("Email webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process email" },
      { status: 500 }
    );
  }
}

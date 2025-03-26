"use server";

import { resend } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmation";
import { formatCurrency } from "@/lib/formatCurrency";

export async function sendOrderConfirmation(order: any) {
  try {
    if (!order.email) {
      console.error("Cannot send email: No email address provided");
      return { success: false, error: "No email address provided" };
    }

    console.log("Sending order confirmation to:", order.email);

    // Format items for the email
    const items = order.products.map((product: any) => ({
      name: product.name || product.product?.name || "Product",
      quantity: product.quantity,
      price: formatCurrency(
        product.unitPrice * product.quantity,
        order.currency || "USD"
      ),
    }));

    // Format date
    const orderDate = order.orderDate
      ? new Date(order.orderDate).toLocaleDateString()
      : new Date().toLocaleDateString();

    // Update to match your working contact form
    const { data, error } = await resend.emails.send({
      from: "Order Confirmation <onboarding@resend.dev>",
      to: [order.email],
      subject: `Order Confirmation #${order.orderNumber}`,
      react: OrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName || "Customer",
        totalAmount: formatCurrency(order.totalPrice, order.currency || "USD"),
        orderDate,
        items,
        shippingAddress: order.shippingAddress || {
          name: "N/A",
          line1: "N/A",
          city: "N/A",
          state: "N/A",
          postalCode: "N/A",
          country: "N/A",
        },
      }),
      replyTo: "xakkahn2001@gmail.com",
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error };
  }
}

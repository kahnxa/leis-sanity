"use server";

import { resend } from "@/lib/resend";
import { formatCurrency } from "@/lib/formatCurrency";
import { Order } from "@/types/order";

export async function sendAdminOrderNotification(order: Order) {
  try {
    console.log(
      "Sending admin order notification for order:",
      order.orderNumber
    );

    // Format items for the email
    const items = order.products.map((product) => ({
      name: product.name || product.product?.name || "Product",
      quantity: product.quantity,
      price: formatCurrency(
        (product.unitPrice || 0) * product.quantity,
        order.currency || "USD"
      ),
    }));

    // Format date
    const orderDate = order.orderDate
      ? new Date(order.orderDate).toLocaleDateString()
      : new Date().toLocaleDateString();

    const { data, error } = await resend.emails.send({
      from: "Order Notification <onboarding@resend.dev>",
      to: ["xakkahn2001@gmail.com"], // Your email address
      subject: `New Order #${order.orderNumber || "Unknown"} - Needs Fulfillment`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>New Order Received</h1>
          <p>A new order has been placed and needs to be fulfilled.</p>
          
          <h2>Order Details</h2>
          <p><strong>Order Number:</strong> ${order.orderNumber || "Unknown"}</p>
          <p><strong>Date:</strong> ${orderDate}</p>
          <p><strong>Customer:</strong> ${order.customerName || "Unknown"}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          
          <h2>Items to Ship</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f3f4f6;">
              <th style="text-align: left; padding: 10px; border: 1px solid #e5e7eb;">Item</th>
              <th style="text-align: center; padding: 10px; border: 1px solid #e5e7eb;">Quantity</th>
              <th style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">Price</th>
            </tr>
            ${items
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.name}</td>
                <td style="text-align: center; padding: 10px; border: 1px solid #e5e7eb;">${item.quantity}</td>
                <td style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">${item.price}</td>
              </tr>
            `
              )
              .join("")}
            <tr style="font-weight: bold; background-color: #f3f4f6;">
              <td colspan="2" style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">Total:</td>
              <td style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">${formatCurrency(order.totalPrice, order.currency || "USD")}</td>
            </tr>
          </table>
          
          <h2>Shipping Address</h2>
          ${
            order.shippingAddress
              ? `
            <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 5px; background-color: #f9fafb;">
              <p style="margin: 5px 0;"><strong>${order.shippingAddress.name}</strong></p>
              <p style="margin: 5px 0;">${order.shippingAddress.line1}</p>
              ${order.shippingAddress.line2 ? `<p style="margin: 5px 0;">${order.shippingAddress.line2}</p>` : ""}
              <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
              <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
            </div>
          `
              : "<p>No shipping address provided</p>"
          }
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p>Please fulfill this order as soon as possible.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send admin notification:", error);
      return { success: false, error };
    }

    console.log("Admin notification sent successfully");
    return { success: true, data };
  } catch (error) {
    console.error("Error sending admin order notification:", error);
    return { success: false, error };
  }
}

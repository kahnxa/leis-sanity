import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
if (!API_KEY) {
  console.error("RESEND_API_KEY not found in environment variables");
}

const resend = new Resend(API_KEY);

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  orderItems: any[],
  shippingAddress: any,
  totalAmount: number
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Leis <orders@leis.com>",
      to: email,
      subject: `Order Confirmation #${orderNumber}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Thank you for your order!</h1>
          <p>Your order #${orderNumber} has been confirmed and will be shipped shortly.</p>
          <p><em>Expected to arrive in 1-2 weeks.</em></p>
          
          <h2>Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f3f4f6;">
              <th style="text-align: left; padding: 10px; border: 1px solid #e5e7eb;">Item</th>
              <th style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">Qty</th>
              <th style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">Price</th>
            </tr>
            ${orderItems
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.product?.name || "Product"}</td>
                <td style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">${item.quantity}</td>
                <td style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">$${(item.product?.price * item.quantity).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
            <tr style="font-weight: bold; background-color: #f3f4f6;">
              <td colspan="2" style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">Total:</td>
              <td style="text-align: right; padding: 10px; border: 1px solid #e5e7eb;">$${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
          
          <h2>Shipping Information</h2>
          <p>
            ${shippingAddress.name}<br>
            ${shippingAddress.line1}<br>
            ${shippingAddress.line2 ? shippingAddress.line2 + "<br>" : ""}
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
            ${shippingAddress.country}
          </p>
          
          <p>If you have any questions about your order, please contact us at <a href="mailto:hello@leis.com">hello@leis.com</a>.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendOrderConfirmationEmail:", error);
    return { success: false, error };
  }
}

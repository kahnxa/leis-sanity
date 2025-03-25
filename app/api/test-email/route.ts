import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function GET() {
  try {
    const result = await sendOrderConfirmationEmail(
      "your-test-email@example.com", // Replace with your email
      "TEST123",
      [{ product: { name: "Test Product", price: 29.99 }, quantity: 1 }],
      {
        name: "Test User",
        line1: "123 Test St",
        line2: "",
        city: "Test City",
        state: "TX",
        postalCode: "12345",
        country: "US",
      },
      39.99
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Test email failed:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

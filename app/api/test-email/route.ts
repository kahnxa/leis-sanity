import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "xakkahn2001@gmail.com", // Your email for testing
      subject: "Test Email",
      text: "This is a test email to verify Resend is working",
    });

    if (error) {
      console.error("Test email error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Test email exception:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

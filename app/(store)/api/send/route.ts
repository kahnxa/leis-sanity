import { Resend } from "resend"; // Make sure to install resend: npm install resend
// This points to the component we'll create next
import { NextResponse } from "next/server";
import { EmailTemplate } from "@/components/ui/email-template";

// Initialize Resend with your API key from environment variables
// IMPORTANT: Add RESEND_API_KEY to your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate the required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // IMPORTANT: Replace with your verified domain after setup
      to: ["xakkahn2001@gmail.com"], // IMPORTANT: Replace with your email address to receive messages
      subject: `Contact Form: ${subject}`,
      react: EmailTemplate({ name, email, message }),
      replyTo: email,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in contact form submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// components/ui/email-template.tsx
import * as React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Text,
  Section,
  Hr,
} from "@react-email/components";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate = ({ name, email, message }: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ padding: "20px", maxWidth: "600px" }}>
          <Heading style={{ color: "#333", marginBottom: "20px" }}>
            New Contact Form Submission
          </Heading>

          <Section style={{ marginBottom: "10px" }}>
            <Text style={{ fontSize: "16px", margin: 0 }}>
              <strong>Name:</strong> {name}
            </Text>
          </Section>

          <Section style={{ marginBottom: "10px" }}>
            <Text style={{ fontSize: "16px", margin: 0 }}>
              <strong>Email:</strong> {email}
            </Text>
          </Section>

          <Section style={{ marginBottom: "20px" }}>
            <Text style={{ fontSize: "16px", margin: 0 }}>
              <strong>Message:</strong>
            </Text>
            <Text
              style={{
                marginTop: "10px",
                padding: "15px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </Text>
          </Section>

          <Hr style={{ borderColor: "#eee", margin: "30px 0 10px" }} />

          <Text
            style={{
              color: "#666",
              fontSize: "14px",
              marginTop: "10px",
            }}
          >
            This message was sent from your website contact form.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

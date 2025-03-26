import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Link,
} from "@react-email/components";
import React from "react";

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  totalAmount: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  totalAmount,
  orderDate,
  items,
  shippingAddress,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your order confirmation #{orderNumber}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ padding: "20px", maxWidth: "600px" }}>
          <Heading as="h1">Order Confirmation</Heading>
          <Text>Hello {customerName},</Text>
          <Text>
            Thank you for your order! We've received your purchase and are
            processing it now.
          </Text>

          <Section style={{ marginTop: "20px" }}>
            <Heading as="h2" style={{ fontSize: "18px" }}>
              Order Details
            </Heading>
            <Text>Order Number: {orderNumber}</Text>
            <Text>Date: {orderDate}</Text>
            <Text>Total: {totalAmount}</Text>
          </Section>

          <Section style={{ marginTop: "20px" }}>
            <Heading as="h2" style={{ fontSize: "18px" }}>
              Items
            </Heading>
            {items.map((item, index) => (
              <Row
                key={index}
                style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}
              >
                <Column>
                  <Text>
                    {item.name} x {item.quantity}
                  </Text>
                </Column>
                <Column align="right">
                  <Text>{item.price}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={{ marginTop: "20px" }}>
            <Heading as="h2" style={{ fontSize: "18px" }}>
              Shipping Address
            </Heading>
            <Text>{shippingAddress.name}</Text>
            <Text>{shippingAddress.line1}</Text>
            {shippingAddress.line2 && <Text>{shippingAddress.line2}</Text>}
            <Text>
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.postalCode}
            </Text>
            <Text>{shippingAddress.country}</Text>
          </Section>

          <Text style={{ marginTop: "30px" }}>
            If you have any questions about your order, please our contact page
            which you can find{" "}
            <Link
              href="https://playleis.com/contact"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              here
            </Link>
            .
          </Text>

          <Text style={{ marginTop: "30px", fontSize: "14px", color: "#666" }}>
            Thank you for shopping with us!
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

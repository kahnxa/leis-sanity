// "use server";

// import { imageUrl } from "@/lib/imageUrl";
// import initializeStripe from "@/lib/stripe";
// import { BasketItem } from "@/store/store";

// export type Metadata = {
//   orderNumber: string;
//   customerName: string;
//   customerEmail: string;
//   clerkUserId: string;
//   billingAddressSameAsShipping: string;
// };

// export type GroupedBasketItem = {
//   product: BasketItem["product"];
//   quantity: number;
// };

// export async function createCheckoutSession(
//   items: GroupedBasketItem[],
//   metadata: Metadata,
//   isBillingAddressSameAsShipping: boolean
// ) {
//   try {
//     const itemsWithoutPrice = items.filter((item) => !item.product.price);
//     if (itemsWithoutPrice.length > 0) {
//       throw new Error("Some items do not have a price");
//     }

//     const stripe = initializeStripe();

//     const existingCustomers = await stripe.customers.list({
//       email: metadata.customerEmail,
//       limit: 1,
//     });

//     const customerId = existingCustomers.data[0]?.id;

//     const baseUrl = process.env.VERCEL_URL
//       ? `https://${process.env.VERCEL_URL}`
//       : process.env.NEXT_PUBLIC_BASE_URL;

//     const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
//     const cancelUrl = `${baseUrl}/basket`;

//     // Calculate total quantity across all items
//     const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

//     // Calculate the subtotal (products only, before shipping)
//     const subtotal = items.reduce(
//       (sum, item) => sum + item.product.price! * 100 * item.quantity,
//       0
//     );

//     // Calculate tax (e.g., 8.25% of subtotal)
//     const taxRate = 0.0825; // 8.25%
//     const taxAmount = Math.round(subtotal * taxRate);

//     // Create line items for products
//     const lineItems = items.map((item) => ({
//       price_data: {
//         currency: "usd",
//         unit_amount: Math.round(item.product.price! * 100),
//         product_data: {
//           name: item.product.name || "Unnamed Product",
//           description: `Product ID: ${item.product._id}`,
//           metadata: { id: item.product._id },
//           images: item.product.image
//             ? [imageUrl(item.product.image).url()]
//             : undefined,
//         },
//       },
//       quantity: item.quantity,
//     }));

//     // Add shipping as a separate line item that scales with quantity
//     lineItems.push({
//       price_data: {
//         currency: "usd",
//         unit_amount: 1000, // $10.00 per unit
//         product_data: {
//           name: "Shipping",
//           description: "Standard Shipping ($10.00 per item)",
//           metadata: { id: "shipping" },
//           images: undefined,
//         },
//       },
//       quantity: totalQuantity,
//     });

//     // Add tax as a separate line item
//     lineItems.push({
//       price_data: {
//         currency: "usd",
//         unit_amount: taxAmount,
//         product_data: {
//           name: "Sales Tax",
//           description: "Sales Tax (8.25%)",
//           metadata: { id: "tax" },
//           images: undefined,
//         },
//       },
//       quantity: 1,
//     });

//     const session = await stripe.checkout.sessions.create({
//       customer: customerId,
//       customer_creation: customerId ? undefined : "always",
//       customer_email: customerId ? undefined : metadata.customerEmail,
//       metadata: {
//         ...metadata,
//         billingAddressSameAsShipping: (
//           isBillingAddressSameAsShipping ?? true
//         ).toString(),
//       },
//       mode: "payment",
//       allow_promotion_codes: true,
//       success_url: successUrl,
//       cancel_url: cancelUrl,
//       line_items: lineItems,
//       // Enable shipping address collection
//       shipping_address_collection: {
//         allowed_countries: ["US"], // Add more countries as needed
//       },
//       // For billing address collection
//       billing_address_collection: "required", // or 'auto' for optional
//     });

//     return session.url;
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     throw error;
//   }
// }

// This is the file tthat causes the order not to be populated in sanity
"use server";

import { imageUrl } from "@/lib/imageUrl";
import initializeStripe from "@/lib/stripe";
import { BasketItem } from "@/store/store";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  billingAddressSameAsShipping: string;
};

export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata,
  isBillingAddressSameAsShipping: boolean
) {
  try {
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price");
    }

    const stripe = initializeStripe();

    const existingCustomers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const customerId = existingCustomers.data[0]?.id;

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL;

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancelUrl = `${baseUrl}/basket`;

    // Calculate total quantity across all items
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate the subtotal (products only, before shipping)
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price! * 100 * item.quantity,
      0
    );

    // Calculate tax (e.g., 8.25% of subtotal)
    const taxRate = 0.0825; // 8.25%
    const taxAmount = Math.round(subtotal * taxRate);

    // Create line items for products
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.product.price! * 100),
        product_data: {
          name: item.product.name || "Unnamed Product",
          description: `Product ID: ${item.product._id}`,
          metadata: { id: item.product._id },
          images: item.product.image
            ? [imageUrl(item.product.image).url()]
            : undefined,
        },
      },
      quantity: item.quantity,
    }));

    // Add shipping as a separate line item that scales with quantity
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: 1000, // $10.00 per unit
        product_data: {
          name: "Shipping",
          description: "Standard Shipping ($10.00 per item)",
          metadata: { id: "shipping" },
          images: undefined,
        },
      },
      quantity: totalQuantity,
    });

    // Add tax as a separate line item
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: taxAmount,
        product_data: {
          name: "Sales Tax",
          description: "Sales Tax (8.25%)",
          metadata: { id: "tax" },
          images: undefined,
        },
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: customerId ? undefined : metadata.customerEmail,
      metadata: {
        ...metadata,
        billingAddressSameAsShipping: (
          isBillingAddressSameAsShipping ?? true
        ).toString(),
        shippingCostPerItem: "10.00",
        taxRate: "0.0825",
      },
      mode: "payment",
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: lineItems,
      // Enable shipping address collection
      shipping_address_collection: {
        allowed_countries: ["US"], // Add more countries as needed
      },
      // For billing address collection
      billing_address_collection: "required", // or 'auto' for optional
    });

    return session.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

import { client } from "@/sanity/lib/client";

export async function createOrder(orderData: any) {
  try {
    // Create the order document in Sanity
    const order = await client.create({
      _type: "order",
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      email: orderData.email,
      products: orderData.products.map((item: any) => ({
        _key: item.id || Math.random().toString(36).substring(2, 9),
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        product: {
          _type: "reference",
          _ref: item.productId,
        },
      })),
      totalPrice: orderData.totalPrice,
      shippingCost: orderData.shippingCost,
      taxAmount: orderData.taxAmount,
      status: "paid",
      orderDate: new Date().toISOString(),
      shippingAddress: orderData.shippingAddress,
      clerkUserId: orderData.clerkUserId,
      currency: orderData.currency || "USD",
    });

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

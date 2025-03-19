import { backendClient } from "@/sanity/lib/backendClient";

export async function updateProductStock(productId: string, quantity: number) {
  try {
    // Check if product exists and has a stock field
    const product = await backendClient.fetch(
      `*[_type == "product" && _id == $productId][0]`,
      { productId }
    );

    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return false;
    }

    // Ensure product has a stock field
    const currentStock = product.stock || 0;
    const newStock = Math.max(0, currentStock - quantity);

    // Update the product stock in Sanity
    await backendClient.patch(productId).set({ stock: newStock }).commit();

    console.log(
      `Updated stock for product ${productId}: ${currentStock} -> ${newStock}`
    );
    return true;
  } catch (error) {
    console.error("Error updating product stock:", error);
    return false;
  }
}

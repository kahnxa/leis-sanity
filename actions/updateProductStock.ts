// actions/updateProductStock.ts
import { backendClient } from "@/sanity/lib/backendClient";

export async function updateProductStock(productId: string, quantity: number) {
  try {
    // Get current stock
    const product = await backendClient.fetch(
      `*[_type == "product" && _id == $productId][0]`,
      { productId }
    );

    if (!product) {
      console.error(`Product not found: ${productId}`);
      return { success: false, error: "Product not found" };
    }

    const currentStock = product.stock || 0;
    const newStock = Math.max(0, currentStock - quantity); // Prevent negative stock

    console.log(
      `Product ${productId}: Current stock ${currentStock}, new stock ${newStock}`
    );

    // Update stock in Sanity
    const result = await backendClient
      .patch(productId)
      .set({ stock: newStock })
      .commit();

    return { success: true, updatedProduct: result };
  } catch (error) {
    console.error(`Error updating product stock:`, error);
    return { success: false, error };
  }
}

// app/shop/page.tsx
import ProductsView from "@/components/ProductsView"; // Adjust path based on your actual data fetching functions
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
export const dynamic = "force-dynamic"; // Optional: Makes the page dynamic instead of static

async function ShopPage() {
  // Fetch products and categories from Sanity
  const products = await getAllProducts();

  return (
    <div className="container mx-auto px-4 pb-12 mt-8">
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      <ProductsView products={products} categories={[]} />
    </div>
  );
}

export default ShopPage;

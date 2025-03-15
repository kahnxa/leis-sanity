// app/shop/page.tsx
import ProductsView from "@/components/ProductsView"; // Adjust path based on your actual data fetching functions
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
export const dynamic = "force-dynamic"; // Optional: Makes the page dynamic instead of static

async function ShopPage() {
  // Fetch products and categories from Sanity
  const products = await getAllProducts();

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <ProductsView products={products} categories={[]} />
    </div>
  );
}

export default ShopPage;

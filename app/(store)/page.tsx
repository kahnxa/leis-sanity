import ProductsView from "@/components/ProductsView";
import HolidaySaleBanner from "@/components/ui/holiday-sale-banner";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  console.log(
    crypto.randomUUID().slice(0, 5) +
      `>>> Rerendered the product page cache for ${products.length} products and ${categories.length} categories`
  );

  return (
    <div>
      <HolidaySaleBanner />
      <div className="flex flex-col itemss-center justify-top min-h-screen bg-gray-100 p-4">
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}

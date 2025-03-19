import ProductsView from "@/components/ProductsView";
import Image from "next/image";

import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col space-y-8">
      {/* Main Hero Image - smaller and with vertical offset */}
      <div className="w-full flex justify-center mt-8">
        <div className="w-3/4 md:w-2/3 lg:w-1/2">
          <Image
            src="/Home_Page.svg"
            alt="Home Page Hero"
            width={1200}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Uncomment when needed */}
      {/* <HolidaySaleBanner /> */}

      {/* Product listing - now visible below the main image */}
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}

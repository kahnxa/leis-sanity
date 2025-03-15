import ProductsView from "@/components/ProductsView";
import HolidaySaleBanner from "@/components/ui/holiday-sale-banner";
import ImageSlider from "@/components/ImageSlider";
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

  // Using productComing.svg for all three slider images
  const sliderImages = [
    {
      url: "/productComing.svg",
      alt: "Product Coming Soon 1",
    },
    {
      url: "/productComing.svg",
      alt: "Product Coming Soon 2",
    },
    {
      url: "/productComing.svg",
      alt: "Product Coming Soon 3",
    },
  ];

  return (
    <div className="flex flex-col space-y-8">
      {/* Image Slider - contained height */}
      <div className="w-full">
        <ImageSlider images={sliderImages} />
      </div>

      {/* Uncomment when needed */}
      {/* <HolidaySaleBanner /> */}

      {/* Product listing - now visible below the slider */}
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}

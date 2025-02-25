import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import Image from "next/image";

export default async function Home() {
  const products = await getAllProducts();

  return <div>{/* render all the products*/}</div>;
}

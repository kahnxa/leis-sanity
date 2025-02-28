"use client";

import { Product } from "@/sanity.types";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  return <div>AddToCartButton</div>;
}

export default AddToCartButton;

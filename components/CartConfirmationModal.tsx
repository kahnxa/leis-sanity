"use client";

import { Product } from "@/sanity.types";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

interface CartConfirmationModalProps {
  product: Product;
  quantity: number;
  onContinueShopping: () => void;
  onCheckout: () => void;
  isLoading: boolean;
}

function CartConfirmationModal({
  product,
  quantity,
  onContinueShopping,
  onCheckout,
  isLoading,
}: CartConfirmationModalProps) {
  const { isSignedIn } = useAuth();

  return (
    <>
      {/* Dimmed Background */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onContinueShopping}
      ></div>

      {/* Modal Content */}
      <div className="fixed top-16 right-4 w-72 bg-white rounded-lg shadow-lg z-50 p-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="font-medium">Added to cart!</p>
        </div>

        {/* Product Preview */}
        <div className="flex items-center mb-4 bg-gray-50 p-2 rounded-md">
          {/* Product Image */}
          <div className="relative w-16 h-16 overflow-hidden rounded-md mr-3 flex-shrink-0">
            {product.image && (
              <Image
                src={imageUrl(product.image).url()}
                alt={product.name || "Product"}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <p className="font-medium text-sm truncate">{product.name}</p>
            <p className="text-gray-600 text-sm">
              ${product.price?.toFixed(2)}
            </p>
            <div className="flex items-center mt-1">
              <p className="text-xs text-gray-500">Quantity:</p>
              <p className="text-xs font-medium ml-1">{quantity}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onContinueShopping}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
          >
            Continue Shopping
          </button>

          {/* Conditional rendering based on sign-in status */}
          {isSignedIn ? (
            <button
              onClick={onCheckout}
              className="w-full py-2 bg-black hover:bg-gray-800 text-white rounded-md text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="w-full py-2 bg-[#27aae1] text-white rounded-md text-sm font-medium hover:bg-[#27aae1]/90">
                Sign in to Checkout
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </>
  );
}

export default CartConfirmationModal;

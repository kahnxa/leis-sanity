"use client";

import { Product } from "@/sanity.types";
import useBasketStore from "@/store/store";
import { useEffect, useState } from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";

interface AddToBasketButtonProps {
  product: Product;
  disabled?: boolean;
}

function AddToBasketButton({ product, disabled }: AddToBasketButtonProps) {
  const { addItem, getItemCount } = useBasketStore();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Use useEffect to set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle adding item to cart
  const handleAddToCart = () => {
    addItem(product);
    const updatedQuantity = getItemCount(product._id);
    setQuantity(updatedQuantity);
    setShowModal(true);
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    setShowModal(false);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!isSignedIn) return;

    setIsLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
        clerkUserId: user!.id,
      };

      const groupedItems = useBasketStore.getState().getGroupedItems();
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative">
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className={`w-full py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-200 ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
        disabled={disabled}
      >
        <span className="text-white font-medium">Add to Cart</span>
      </button>

      {/* Modal */}
      {showModal && (
        <>
          {/* Dimmed Background */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleContinueShopping}
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
                onClick={handleContinueShopping}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleCheckout}
                className="w-full py-2 bg-black hover:bg-gray-800 text-white rounded-md text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AddToBasketButton;

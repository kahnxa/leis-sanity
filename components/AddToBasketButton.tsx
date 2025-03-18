"use client";

import { Product } from "@/sanity.types";
import useBasketStore from "@/store/store";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import CartConfirmationModal from "./CartConfirmationModal";

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
        <CartConfirmationModal
          product={product}
          quantity={quantity}
          onContinueShopping={handleContinueShopping}
          onCheckout={handleCheckout}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default AddToBasketButton;

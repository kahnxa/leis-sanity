"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useBasketStore from "@/store/store";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearBasket = useBasketStore((state) => state.clearBasket);

  useEffect(() => {
    if (orderNumber) {
      clearBasket();
    }
  }, [orderNumber, clearBasket]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full mx-4">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-6 text-center">
          Thank you for your order!
        </h1>
        <div className="border-t border-b border-gray-200 py-6 mb-6 text-center">
          <p className="text-lg text-gray-700 mb-4">
            Your order has been confirmed and will be shipped shortly.
          </p>
          <p className="text-md text-gray-700 mb-4 italic">
            Expected to arrive in 1-2 weeks.
          </p>
          <div className="space-y-2">
            {orderNumber && (
              <p className="text-gray-600 items-center space-x-5">
                <span>Order Number:</span>
                <span className="font-mono text-sm text-green-600">
                  {orderNumber}
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4 text-center">
          <p className="text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/orders">View Order Details</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with Suspense
function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full mx-4 text-center">
            <h1 className="text-2xl font-bold mb-4">
              Loading order details...
            </h1>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}

export default SuccessPage;

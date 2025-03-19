"use client";

interface ItemQuantityControlProps {
  productId: string;
  quantity: number;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  stock?: number; // Using stock to match your Sanity schema
}

function ItemQuantityControl({
  productId,
  quantity,
  onIncrement,
  onDecrement,
  stock = Infinity, // Default to unlimited if not provided
}: ItemQuantityControlProps) {
  const handleIncrement = () => {
    // Only allow increment if below stock limit
    if (quantity < stock) {
      onIncrement(productId);
    }
  };

  const handleDecrement = () => {
    onDecrement(productId);
  };

  // Determine if increment button should be disabled
  const isIncrementDisabled = quantity >= stock;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center border rounded">
        <button
          onClick={handleDecrement}
          className="px-3 py-1 text-lg font-medium hover:bg-gray-100"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="px-3 py-1 min-w-8 text-center">{quantity}</span>
        <button
          onClick={handleIncrement}
          className={`px-3 py-1 text-lg font-medium ${
            isIncrementDisabled
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          aria-label="Increase quantity"
          disabled={isIncrementDisabled}
        >
          +
        </button>
      </div>
      {isIncrementDisabled && quantity > 0 && (
        <span className="text-xs text-red-500 mt-1">Max stock reached</span>
      )}
    </div>
  );
}

export default ItemQuantityControl;

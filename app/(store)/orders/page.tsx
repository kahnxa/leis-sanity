import { formatCurrency } from "@/lib/formatCurrency";
import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

export default async function Orders() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const orders = await getMyOrders(userId);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Order #
                    </h3>
                    <p className="text-md font-mono">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "No date"}
                    </span>
                    <span
                      className={`ml-3 px-3 py-1 rounded-full text-xs font-medium capitalize inline-block ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 sm:py-4">
                  <h2 className="text-sm font-semibold text-gray-600 mb-3 sm:mb-4">
                    Order Items
                  </h2>

                  <div className="space-y-3 sm:space-y-4">
                    {order.products?.map((product, index) => (
                      <div
                        key={
                          product.product?._id ||
                          product._key ||
                          `product-${index}`
                        }
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b last:border-b-0"
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-center">
                            {product.product?.image && (
                              <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-md overflow-hidden mr-3">
                                <Image
                                  src={imageUrl(product.product.image).url()}
                                  alt={product.product?.name ?? ""}
                                  className="object-cover"
                                  fill
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm sm:text-base">
                                {product.product?.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {product.quantity ?? "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <p className="font-medium text-gray-700">
                              {product.product?.price && product.quantity
                                ? formatCurrency(
                                    product.product.price * product.quantity,
                                    order.currency
                                  )
                                : "N/A"}
                            </p>

                            {(order.shippingCost ?? 0) > 0 && (
                              <span className="text-sm text-gray-500">
                                + Shipping:{" "}
                                {formatCurrency(
                                  order.shippingCost ?? 0,
                                  order.currency
                                )}
                              </span>
                            )}

                            {(order.taxAmount ?? 0) > 0 && (
                              <span className="text-sm text-gray-500">
                                + Tax:{" "}
                                {formatCurrency(
                                  order.taxAmount ?? 0,
                                  order.currency
                                )}
                              </span>
                            )}

                            <div className="mt-3 pt-2 border-t border-gray-200 w-full text-right">
                              <span className="text-lg font-bold text-blue-600">
                                Total:{" "}
                                {formatCurrency(
                                  order.totalPrice ?? 0,
                                  order.currency
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-3 sm:px-6 sm:py-4">
                    <p className="text-sm font-semibold text-gray-600 mb-3 sm:mb-4">
                      Shipped To
                    </p>
                    {order.shippingAddress ? (
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">
                          {order.shippingAddress.name}
                        </p>
                        <p>{order.shippingAddress.line1}</p>
                        {order.shippingAddress.line2 && (
                          <p>{order.shippingAddress.line2}</p>
                        )}
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postalCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No shipping information
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export interface OrderItem {
  product?: {
    name?: string;
    price?: number;
  };
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  customerName?: string;
  email: string;
  products: OrderItem[];
  totalPrice: number;
  currency?: string;
  orderDate?: string;
  shippingAddress?: ShippingAddress;
}

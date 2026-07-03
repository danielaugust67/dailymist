import { Models } from "node-appwrite";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  shippingAddress: any;
  trackingNumber?: string;
  paidAt?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export function mapOrder(doc: Models.Document): Order {
  let parsedItems = [];
  try {
    parsedItems = typeof doc.items === "string" ? JSON.parse(doc.items) : doc.items;
  } catch (e) {
    console.error("Failed to parse order items", e);
  }

  let parsedAddress = null;
  try {
    parsedAddress = typeof doc.shipping_address === "string" ? JSON.parse(doc.shipping_address) : doc.shipping_address;
  } catch (e) {
    console.error("Failed to parse shipping address", e);
  }

  return {
    id: doc.$id,
    userId: doc.user_id,
    orderNumber: doc.order_number,
    items: parsedItems,
    subtotal: doc.subtotal,
    shippingFee: doc.shipping_fee,
    total: doc.total,
    status: doc.status,
    paymentStatus: doc.payment_status,
    paymentMethod: doc.payment_method,
    shippingAddress: parsedAddress,
    trackingNumber: doc.tracking_number,
    paidAt: doc.paid_at,
    paymentReference: doc.payment_reference,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
  };
}

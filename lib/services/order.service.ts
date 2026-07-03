import { createAdminClient } from "../appwrite/server";
import { appwriteConfig } from "../appwrite/config";
import { ID, Permission, Role, Query } from "node-appwrite";
import { OrderItem, Order, mapOrder } from "../mappers/order.mapper";
import { getProductBySlug } from "../repositories/product.repository";

const DB_ID = appwriteConfig.databaseId;
const ORDERS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;

export async function createOrder(
  userId: string,
  cartItems: any[],
  shippingAddress: any,
  paymentMethod: string
): Promise<Order> {
  const { databases } = await createAdminClient();

  // Validate prices & calculate total securely on the server
  let subtotal = 0;
  const validatedItems: OrderItem[] = [];

  for (const item of cartItems) {
    // Assuming cartItems passes slug to fetch product
    const product = await getProductBySlug(item.slug);
    if (!product || !product.isActive) {
      throw new Error(`Product ${item.name} is unavailable.`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
    }

    subtotal += product.price * item.quantity;
    validatedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      imageUrl: product.imageUrls?.[0],
    });
  }

  const shippingFee = subtotal > 150 ? 0 : 15; // Example logic: free shipping over $150
  const total = subtotal + shippingFee;

  const orderNumber = `DM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

  const document = await databases.createDocument(
    DB_ID,
    ORDERS_COLLECTION,
    ID.unique(),
    {
      user_id: userId,
      order_number: orderNumber,
      items: JSON.stringify(validatedItems),
      subtotal,
      shipping_fee: shippingFee,
      total,
      status: "pending",
      payment_status: "unpaid",
      payment_method: paymentMethod,
      shipping_address: JSON.stringify(shippingAddress),
    },
    [
      Permission.read(Role.user(userId)),
      Permission.read(Role.team("admins")),
      Permission.update(Role.team("admins")),
      Permission.delete(Role.team("admins")),
    ]
  );

  return mapOrder(document);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { databases } = await createAdminClient();
  const response = await databases.listDocuments(DB_ID, ORDERS_COLLECTION, [
    Query.equal("user_id", userId),
    Query.orderDesc("$createdAt"),
  ]);
  return response.documents.map(mapOrder);
}

export async function getOrderById(orderId: string, userId: string): Promise<Order | null> {
  try {
    const { databases } = await createAdminClient();
    const document = await databases.getDocument(DB_ID, ORDERS_COLLECTION, orderId);
    
    // Authorization check (bypassed if userId is admin, but here we strictly check if it's for user, 
    // unless we need an admin getOrderById, which we can separate or modify)
    if (userId !== "admin" && document.user_id !== userId) {
      throw new Error("Unauthorized");
    }
    
    return mapOrder(document);
  } catch (error) {
    return null;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const { databases } = await createAdminClient();
  const response = await databases.listDocuments(DB_ID, ORDERS_COLLECTION, [
    Query.orderDesc("$createdAt"),
    Query.limit(100), // In production, add pagination
  ]);
  return response.documents.map(mapOrder);
}

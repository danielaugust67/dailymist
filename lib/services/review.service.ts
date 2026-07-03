import { createAdminClient } from "../appwrite/server";
import { appwriteConfig } from "../appwrite/config";
import { ID, Permission, Role, Query } from "node-appwrite";
import { Review, mapReview } from "../mappers/review.mapper";
import { getOrdersByUser } from "./order.service";

const DB_ID = appwriteConfig.databaseId;
const REVIEWS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!;
const PRODUCTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

export async function checkReviewEligibility(userId: string, productId: string): Promise<boolean> {
  // To review, user must have a 'completed' order that contains the product
  const orders = await getOrdersByUser(userId);
  const completedOrders = orders.filter(o => o.status === "completed");

  for (const order of completedOrders) {
    if (order.items.some(item => item.productId === productId)) {
      return true;
    }
  }
  return false;
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const { databases } = await createAdminClient();
  const response = await databases.listDocuments(DB_ID, REVIEWS_COLLECTION, [
    Query.equal("product_id", productId),
    Query.orderDesc("$createdAt"),
    Query.limit(50),
  ]);
  return response.documents.map(mapReview);
}

export async function createReview(
  userId: string, 
  userName: string, 
  productId: string, 
  rating: number, 
  comment: string
): Promise<Review> {
  const isEligible = await checkReviewEligibility(userId, productId);
  if (!isEligible) {
    throw new Error("You can only review products you have purchased and received.");
  }

  const { databases } = await createAdminClient();

  // Create review
  const document = await databases.createDocument(
    DB_ID,
    REVIEWS_COLLECTION,
    ID.unique(),
    {
      product_id: productId,
      user_id: userId,
      user_name: userName,
      rating,
      comment,
    },
    [
      Permission.read(Role.any()),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
      Permission.update(Role.team("admins")),
      Permission.delete(Role.team("admins")),
    ]
  );

  // Update product average rating asynchronously
  updateProductRating(productId, databases).catch(console.error);

  return mapReview(document);
}

async function updateProductRating(productId: string, databases: any) {
  // In a high-traffic app, this should be done via an Appwrite Function trigger,
  // but we can do it inline here for simplicity.
  const response = await databases.listDocuments(DB_ID, REVIEWS_COLLECTION, [
    Query.equal("product_id", productId),
    Query.limit(1000), // assuming max 1000 reviews for calculation
  ]);

  const reviews = response.documents;
  if (reviews.length === 0) return;

  const totalRating = reviews.reduce((sum: number, rev: any) => sum + rev.rating, 0);
  const avgRating = totalRating / reviews.length;

  await databases.updateDocument(DB_ID, PRODUCTS_COLLECTION, productId, {
    rating_avg: parseFloat(avgRating.toFixed(1)),
  });
}

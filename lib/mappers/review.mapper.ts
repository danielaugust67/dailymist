import { Models } from "node-appwrite";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function mapReview(doc: Models.Document): Review {
  return {
    id: doc.$id,
    productId: doc.product_id,
    userId: doc.user_id,
    userName: doc.user_name,
    rating: doc.rating,
    comment: doc.comment,
    createdAt: doc.$createdAt,
  };
}

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  collections: {
    products: process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
    categories: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
    orders: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
    reviews: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!,
    addresses: process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_COLLECTION_ID!,
  },
  buckets: {
    productImages: process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_IMAGES_BUCKET_ID!,
    banners: process.env.NEXT_PUBLIC_APPWRITE_BANNERS_BUCKET_ID!,
  },
  apiKey: process.env.APPWRITE_API_KEY!,
};

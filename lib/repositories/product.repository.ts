import { createAdminClient } from "../appwrite/server";
import { appwriteConfig } from "../appwrite/config";
import { Query } from "node-appwrite";
import { mapProduct, mapCategory, Product, Category } from "../mappers/product.mapper";

const DB_ID = appwriteConfig.databaseId;
const PRODUCTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const CATEGORIES_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!;

export async function getCategories(): Promise<Category[]> {
  const { databases } = await createAdminClient();
  const response = await databases.listDocuments(DB_ID, CATEGORIES_COLLECTION, [
    Query.orderAsc("name"),
    Query.limit(100)
  ]);
  return response.documents.map(mapCategory);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { databases } = await createAdminClient();
    const document = await databases.getDocument(DB_ID, CATEGORIES_COLLECTION, id);
    return mapCategory(document);
  } catch (error) {
    return null;
  }
}

export async function getProducts(options?: {
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
  includeInactive?: boolean;
}): Promise<{ products: Product[]; total: number }> {
  const { databases } = await createAdminClient();
  const queries = [
    Query.orderDesc("$createdAt")
  ];

  if (!options?.includeInactive) {
    queries.push(Query.equal("is_active", true));
  }

  if (options?.categoryId) {
    queries.push(Query.equal("category_id", options.categoryId));
  }
  if (options?.isFeatured !== undefined) {
    queries.push(Query.equal("is_featured", options.isFeatured));
  }
  if (options?.limit) {
    queries.push(Query.limit(options.limit));
  }
  if (options?.offset) {
    queries.push(Query.offset(options.offset));
  }
  if (options?.search) {
    queries.push(Query.search("name", options.search));
  }

  const response = await databases.listDocuments(DB_ID, PRODUCTS_COLLECTION, queries);
  const products = response.documents.map(mapProduct);

  return {
    products,
    total: response.total
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(DB_ID, PRODUCTS_COLLECTION, [
      Query.equal("slug", slug),
      Query.limit(1)
    ]);

    if (response.documents.length === 0) return null;

    const product = mapProduct(response.documents[0]);
    
    if (product.categoryId) {
      const category = await getCategoryById(product.categoryId);
      if (category) {
        product.category = category;
      }
    }

    return product;
  } catch (error) {
    return null;
  }
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const { databases } = await createAdminClient();
  const document = await databases.createDocument(
    DB_ID,
    PRODUCTS_COLLECTION,
    "unique()",
    {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category_id: data.categoryId,
      images: data.imageUrls,
      is_active: data.isActive ?? true,
      is_featured: data.isFeatured ?? false,
    }
  );
  return mapProduct(document);
}

export async function updateProduct(id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Promise<Product> {
  const { databases } = await createAdminClient();
  const payload: any = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.description !== undefined) payload.description = data.description;
  if (data.price !== undefined) payload.price = data.price;
  if (data.stock !== undefined) payload.stock = data.stock;
  if (data.categoryId !== undefined) payload.category_id = data.categoryId;
  if (data.imageUrls !== undefined) payload.images = data.imageUrls;
  if (data.isActive !== undefined) payload.is_active = data.isActive;
  if (data.isFeatured !== undefined) payload.is_featured = data.isFeatured;

  const document = await databases.updateDocument(
    DB_ID,
    PRODUCTS_COLLECTION,
    id,
    payload
  );
  return mapProduct(document);
}

export async function deleteProduct(id: string): Promise<void> {
  const { databases } = await createAdminClient();
  await databases.deleteDocument(DB_ID, PRODUCTS_COLLECTION, id);
}

export async function createCategory(data: { name: string; slug: string; description?: string }): Promise<Category> {
  const { databases } = await createAdminClient();
  const document = await databases.createDocument(
    DB_ID,
    CATEGORIES_COLLECTION,
    "unique()",
    {
      name: data.name,
      slug: data.slug,
      is_active: true,
    }
  );
  return mapCategory(document);
}

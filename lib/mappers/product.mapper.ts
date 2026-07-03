export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrls: string[];
  isActive: boolean;
  isFeatured: boolean;
  ratingAvg: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Optional populated category
  category?: Category;
}

export function mapCategory(document: any): Category {
  return {
    id: document.$id,
    name: document.name,
    slug: document.slug,
    description: document.description,
    imageUrl: document.image_url || document.image,
    createdAt: document.$createdAt,
    updatedAt: document.$updatedAt,
  };
}

export function mapProduct(document: any): Product {
  return {
    id: document.$id,
    categoryId: document.category_id,
    name: document.name,
    slug: document.slug,
    description: document.description,
    price: document.price,
    stock: document.stock,
    sku: document.sku,
    imageUrls: document.image_urls || document.images || [],
    isActive: document.is_active,
    isFeatured: document.is_featured,
    ratingAvg: document.rating_avg,
    reviewCount: document.review_count,
    createdAt: document.$createdAt,
    updatedAt: document.$updatedAt,
  };
}

import { getProductBySlug } from "@/lib/repositories/product.repository";
import { apiSuccess, apiError } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const product = await getProductBySlug(slug);
    
    if (!product) {
      return apiError("NOT_FOUND", "Product not found", 404);
    }
    
    return apiSuccess(product, 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch product", 500);
  }
}

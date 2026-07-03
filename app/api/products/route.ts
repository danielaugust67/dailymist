import { getProducts } from "@/lib/repositories/product.repository";
import { apiSuccess, apiError } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;
    
    const isFeaturedParam = searchParams.get("isFeatured");
    const isFeatured = isFeaturedParam ? isFeaturedParam === 'true' : undefined;
    const includeInactive = searchParams.get("includeInactive") === "true";

    const data = await getProducts({ categoryId, search, isFeatured, limit, offset, includeInactive });
    return apiSuccess(data, 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch products", 500);
  }
}

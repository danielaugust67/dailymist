import { getCategories } from "@/lib/repositories/product.repository";
import { apiSuccess, apiError } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories();
    return apiSuccess(categories, 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error.message || "Failed to fetch categories", 500);
  }
}

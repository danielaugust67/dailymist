import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { createProduct } from "@/lib/repositories/product.repository";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user || !user.labels?.includes("admin")) {
      return NextResponse.json(createErrorResponse("Unauthorized", 403), { status: 403 });
    }

    const data = await request.json();
    const product = await createProduct(data);
    
    return NextResponse.json(createSuccessResponse(product));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

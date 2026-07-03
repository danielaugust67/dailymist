import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { updateProduct, deleteProduct } from "@/lib/repositories/product.repository";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser();
    if (!user || !user.labels?.includes("admin")) {
      return NextResponse.json(createErrorResponse("Unauthorized", 403), { status: 403 });
    }

    const id = (await params).id;
    const data = await request.json();
    const product = await updateProduct(id, data);
    
    return NextResponse.json(createSuccessResponse(product));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser();
    if (!user || !user.labels?.includes("admin")) {
      return NextResponse.json(createErrorResponse("Unauthorized", 403), { status: 403 });
    }

    const id = (await params).id;
    await deleteProduct(id);
    
    return NextResponse.json(createSuccessResponse(null, "Product deleted successfully"));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

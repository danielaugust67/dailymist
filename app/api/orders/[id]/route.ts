import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { getOrderById } from "@/lib/services/order.service";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json(createErrorResponse("Unauthorized", 401), { status: 401 });
    }

    const orderId = (await params).id;
    const order = await getOrderById(orderId, user.$id);
    
    if (!order) {
      return NextResponse.json(createErrorResponse("Order not found", 404), { status: 404 });
    }

    return NextResponse.json(createSuccessResponse(order));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

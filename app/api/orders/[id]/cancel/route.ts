import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser, createAdminClient } from "@/lib/appwrite/server";
import { getOrderById } from "@/lib/services/order.service";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { appwriteConfig } from "@/lib/appwrite/config";
import { mapOrder } from "@/lib/mappers/order.mapper";

export async function PATCH(
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

    if (order.status !== "pending") {
      return NextResponse.json(createErrorResponse("Only pending orders can be cancelled", 400), { status: 400 });
    }

    const { databases } = await createAdminClient();
    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
      orderId,
      {
        status: "cancelled",
        payment_status: "failed" // or keep it unpaid, but effectively cancelled
      }
    );

    return NextResponse.json(createSuccessResponse(mapOrder(updated)));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

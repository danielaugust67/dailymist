import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser, createAdminClient } from "@/lib/appwrite/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { appwriteConfig } from "@/lib/appwrite/config";
import { mapOrder } from "@/lib/mappers/order.mapper";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser();
    if (!user || !user.labels?.includes("admin")) {
      return NextResponse.json(createErrorResponse("Forbidden", 403), { status: 403 });
    }

    const orderId = (await params).id;
    const body = await request.json();
    const { status, paymentStatus, trackingNumber } = body;

    const { databases } = await createAdminClient();
    
    const payload: any = {};
    if (status !== undefined) payload.status = status;
    if (paymentStatus !== undefined) payload.payment_status = paymentStatus;
    if (trackingNumber !== undefined) payload.tracking_number = trackingNumber;

    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
      orderId,
      payload
    );

    return NextResponse.json(createSuccessResponse(mapOrder(updated)));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

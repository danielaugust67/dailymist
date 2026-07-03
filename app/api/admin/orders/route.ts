import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { getAllOrders } from "@/lib/services/order.service";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user || !user.labels?.includes("admin")) {
      return NextResponse.json(createErrorResponse("Forbidden", 403), { status: 403 });
    }

    const orders = await getAllOrders();
    return NextResponse.json(createSuccessResponse(orders));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { createOrder, getOrdersByUser } from "@/lib/services/order.service";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json(createErrorResponse("Unauthorized", 401), { status: 401 });
    }

    const orders = await getOrdersByUser(user.$id);
    return NextResponse.json(createSuccessResponse(orders));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json(createErrorResponse("Unauthorized", 401), { status: 401 });
    }

    const { cartItems, shippingAddress, paymentMethod } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(createErrorResponse("Cart is empty", 400), { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json(createErrorResponse("Shipping address is required", 400), { status: 400 });
    }

    const order = await createOrder(user.$id, cartItems, shippingAddress, paymentMethod);
    
    return NextResponse.json(createSuccessResponse(order));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 400), { status: 400 });
  }
}

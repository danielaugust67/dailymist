import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { updateAddress, deleteAddress } from "@/lib/repositories/address.repository";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json(createErrorResponse("Unauthorized", 401), { status: 401 });
    }

    const id = (await params).id;
    const data = await request.json();
    const address = await updateAddress(id, user.$id, data);
    
    return NextResponse.json(createSuccessResponse(address));
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
    if (!user) {
      return NextResponse.json(createErrorResponse("Unauthorized", 401), { status: 401 });
    }

    const id = (await params).id;
    await deleteAddress(id, user.$id);
    
    return NextResponse.json(createSuccessResponse(null, "Address deleted successfully"));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { getLoggedInUser } from "@/lib/auth";
import { getUserAddresses, createAddress } from "@/lib/repositories/address.repository";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return apiError("UNAUTHORIZED", "Unauthorized", 401);
    }

    const addresses = await getUserAddresses(user.$id);
    return apiSuccess(addresses);
  } catch (error: any) {
    return apiError("INTERNAL_ERROR", error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return apiError("UNAUTHORIZED", "Unauthorized", 401);
    }

    const data = await request.json();
    const address = await createAddress(user.$id, data);
    return apiSuccess(address);
  } catch (error: any) {
    return apiError("INTERNAL_ERROR", error.message, 500);
  }
}

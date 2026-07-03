import { createSessionClient } from "@/lib/appwrite/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");

    const cookieStore = await cookies();
    cookieStore.delete(`a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);

    return apiSuccess(null, 200);
  } catch (error) {
    return apiError("INTERNAL_SERVER_ERROR", "Failed to logout", 500);
  }
}

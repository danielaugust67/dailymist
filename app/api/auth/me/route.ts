import { getLoggedInUser } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { cookies } from "next/headers";

export async function GET() {
  const user = await getLoggedInUser();
  if (!user) {
    const cookieStore = await cookies();
    cookieStore.delete(`a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);
    return apiError("UNAUTHORIZED", "Not logged in", 401);
  }
  return apiSuccess(user, 200);
}

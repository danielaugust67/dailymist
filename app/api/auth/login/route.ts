import { createAdminClient } from "@/lib/appwrite/server";
import { loginSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { AppwriteException } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(
      validatedData.email,
      validatedData.password
    );

    const cookieStore = await cookies();
    cookieStore.set(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      session.secret,
      {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
    );

    return apiSuccess(session, 200);
  } catch (error: any) {
    if (error instanceof AppwriteException) {
      if (error.code === 401) {
        return apiError("UNAUTHORIZED", "Invalid email or password", 401);
      }
      return apiError("INTERNAL_SERVER_ERROR", error.message, 500);
    }
    return apiError("BAD_REQUEST", error?.message || "Invalid input", 400);
  }
}

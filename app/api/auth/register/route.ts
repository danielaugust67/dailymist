import { createAdminClient } from "@/lib/appwrite/server";
import { registerSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppwriteException, ID } from "node-appwrite";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const { account } = await createAdminClient();
    const user = await account.create(
      ID.unique(),
      validatedData.email,
      validatedData.password,
      validatedData.name
    );

    return apiSuccess(user, 201);
  } catch (error: any) {
    if (error instanceof AppwriteException) {
      if (error.code === 409) {
        return apiError("EMAIL_ALREADY_EXISTS", "Email is already in use", 409);
      }
      return apiError("INTERNAL_SERVER_ERROR", error.message, 500);
    }
    return apiError("BAD_REQUEST", error?.message || "Invalid input", 400);
  }
}

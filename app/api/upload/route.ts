import { createAdminClient } from "@/lib/appwrite/server";
import { ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user || !user.labels?.includes("admin")) {
      return NextResponse.json(createErrorResponse("Unauthorized", 403), { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json(createErrorResponse("No file provided", 400), { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    
    const { storage } = await createAdminClient();
    
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_IMAGES_BUCKET_ID!;
    const uploadedFile = await storage.createFile(
      bucketId,
      ID.unique(),
      InputFile.fromBuffer(Buffer.from(buffer), file.name),
      [Permission.read(Role.any())]
    );

    // Construct public URL
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const fileUrl = `${endpoint}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${projectId}`;

    return NextResponse.json(createSuccessResponse({
      fileId: uploadedFile.$id,
      url: fileUrl
    }));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

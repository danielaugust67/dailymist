import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { mapOrder } from "@/lib/mappers/order.mapper";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { result } = await request.json(); // "success" | "failed" | "expired"
    const orderId = (await params).id;
    const { databases } = await createAdminClient();

    const statusMap = {
      success: { payment_status: "paid", status: "processing" },
      failed: { payment_status: "failed", status: "cancelled" },
      expired: { payment_status: "unpaid", status: "cancelled" },
    };

    const update = statusMap[result as keyof typeof statusMap];
    if (!update) {
      return NextResponse.json({ error: "invalid result" }, { status: 400 });
    }

    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
      orderId,
      {
        ...update,
        paid_at: result === "success" ? new Date().toISOString() : null,
        payment_reference: `MOCK-${crypto.randomUUID()}`,
      }
    );

    // If payment is success, trigger stock reduction
    if (result === "success") {
      const order = mapOrder(updated);
      for (const item of order.items) {
        try {
          const productDoc = await databases.getDocument(
            appwriteConfig.databaseId,
            process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
            item.productId
          );
          
          if (productDoc.stock >= item.quantity) {
            await databases.updateDocument(
              appwriteConfig.databaseId,
              process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
              item.productId,
              {
                stock: productDoc.stock - item.quantity,
                sold_count: (productDoc.sold_count || 0) + item.quantity
              }
            );
          }
        } catch (e) {
          console.error(`Failed to update stock for product ${item.productId}`, e);
        }
      }
    }

    return NextResponse.json({ data: mapOrder(updated) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

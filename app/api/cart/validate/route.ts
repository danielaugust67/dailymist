import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/repositories/product.repository";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const items = data.items;

    if (!Array.isArray(items)) {
      return NextResponse.json(createErrorResponse("Invalid items", 400), { status: 400 });
    }

    const validatedItems = [];
    const warnings = [];

    for (const item of items) {
      const dbProduct = await getProductBySlug(item.slug);

      if (!dbProduct || !dbProduct.isActive) {
        warnings.push(`Product ${item.name} is no longer available.`);
        continue;
      }

      let validQuantity = item.quantity;
      if (dbProduct.stock < item.quantity) {
        validQuantity = dbProduct.stock;
        if (validQuantity > 0) {
          warnings.push(`Only ${validQuantity} units of ${item.name} are available.`);
        } else {
          warnings.push(`Product ${item.name} is out of stock.`);
          continue;
        }
      }

      if (dbProduct.price !== item.price) {
        warnings.push(`The price of ${item.name} has changed from $${item.price} to $${dbProduct.price}.`);
      }

      validatedItems.push({
        ...item,
        price: dbProduct.price,
        quantity: validQuantity,
        imageUrl: dbProduct.imageUrls?.[0] || item.imageUrl
      });
    }

    return NextResponse.json(createSuccessResponse({
      items: validatedItems,
      warnings,
    }));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

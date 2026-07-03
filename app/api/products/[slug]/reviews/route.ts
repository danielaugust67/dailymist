import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { getReviewsByProduct, createReview, checkReviewEligibility } from "@/lib/services/review.service";
import { getProductBySlug } from "@/lib/repositories/product.repository";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json(createErrorResponse("Product not found", 404), { status: 404 });
    }

    const reviews = await getReviewsByProduct(product.id);
    
    // Also return eligibility if logged in
    let isEligible = false;
    const user = await getLoggedInUser();
    if (user) {
      isEligible = await checkReviewEligibility(user.$id, product.id);
    }

    return NextResponse.json(createSuccessResponse({ reviews, isEligible }));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 500), { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json(createErrorResponse("Unauthorized", 401), { status: 401 });
    }

    const slug = (await params).slug;
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json(createErrorResponse("Product not found", 404), { status: 404 });
    }

    const { rating, comment } = await request.json();
    
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(createErrorResponse("Invalid rating", 400), { status: 400 });
    }

    const review = await createReview(
      user.$id,
      user.name || "Anonymous",
      product.id,
      rating,
      comment
    );

    return NextResponse.json(createSuccessResponse(review));
  } catch (error: any) {
    return NextResponse.json(createErrorResponse(error.message, 400), { status: 400 });
  }
}

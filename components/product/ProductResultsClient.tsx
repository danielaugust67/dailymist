"use client";

import Link from "next/link";
import { Product } from "@/lib/mappers/product.mapper";
import { useAutoFetch } from "@/hooks/useAutoFetch";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

interface ProductResultsPayload {
  products: Product[];
  total: number;
}

interface ProductResultsClientProps {
  initialData: ProductResultsPayload;
  categoryId?: string;
  search: string;
  page: number;
  limit: number;
}

export function ProductResultsClient({
  initialData,
  categoryId,
  search,
  page,
  limit,
}: ProductResultsClientProps) {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (categoryId) params.set("categoryId", categoryId);
  if (search) params.set("search", search);

  const { data, isLoading, error, refetch } = useAutoFetch<ProductResultsPayload>(
    `/api/products?${params.toString()}`,
    {
      initialData,
      intervalMs: 30000,
      refetchOnFocus: true,
    }
  );

  const products = data.products ?? [];
  const total = data.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
  const categoryQuery = categoryId ? `&categoryId=${encodeURIComponent(categoryId)}` : "";

  return (
    <>
      <form action="/products" className="mb-8">
        {categoryId && <input type="hidden" name="categoryId" value={categoryId} />}
        <div className="relative">
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search fragrances..."
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg py-4 pl-12 pr-32 text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary focus:ring-0 transition-colors"
            style={{ fontFamily: dmSans, fontSize: "16px" }}
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
            search
          </span>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded-md px-5 py-2.5 uppercase tracking-widest hover:opacity-90 transition-opacity"
            style={{ fontFamily: dmSans, fontSize: "12px", fontWeight: 600 }}
          >
            Search
          </button>
        </div>
        {search && (
          <Link
            href={categoryId ? `/products?categoryId=${encodeURIComponent(categoryId)}` : "/products"}
            className="mt-3 inline-flex items-center gap-1 text-on-surface-variant hover:text-primary uppercase tracking-widest"
            style={{ fontFamily: dmSans, fontSize: "11px", fontWeight: 600 }}
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
            Clear Search
          </Link>
        )}
      </form>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 py-4 border-y border-secondary/5">
        <p
          className="text-on-surface-variant uppercase tracking-widest mb-4 sm:mb-0"
          style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
        >
          {total} Results Found
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary uppercase tracking-widest"
          style={{ fontFamily: dmSans, fontSize: "11px", fontWeight: 600 }}
        >
          <span className={`material-symbols-outlined text-[16px] ${isLoading ? "animate-spin" : ""}`}>refresh</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-error-container bg-error-container/40 px-4 py-3 text-error" style={{ fontFamily: dmSans, fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 ${isLoading ? "opacity-70" : ""}`}>
        {products.map((product) => (
          <Link href={`/products/${product.slug}`} key={product.id} className="group product-card relative">
            <div className="aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden mb-6 relative">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                src={product.imageUrls?.[0] || "https://placehold.co/400x500/f6f3f2/5e5e5c?text=DailyMist"}
                alt={product.name}
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6 translate-y-4 group-hover:translate-y-0">
                <div
                  className="w-full bg-primary text-white py-4 uppercase shadow-xl text-center"
                  style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
                >
                  View Product
                </div>
              </div>
            </div>
            <h3
              className="text-on-surface mb-2"
              style={{ fontFamily: playfair, fontSize: "24px", lineHeight: "1.4", fontWeight: 400 }}
            >
              {product.name}
            </h3>
            <p className="text-on-surface-variant" style={{ fontFamily: dmSans, fontSize: "16px" }}>
              ${product.price}
            </p>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 border border-outline-variant/20 rounded-lg bg-surface-container-lowest">
          <div className="w-16 h-16 rounded-full bg-surface-container mx-auto mb-6 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">search_off</span>
          </div>
          <h2 className="text-on-surface mb-3" style={{ fontFamily: playfair, fontSize: "28px", lineHeight: "1.3" }}>
            No fragrances found
          </h2>
          <p className="text-on-surface-variant mb-6" style={{ fontFamily: dmSans, fontSize: "16px" }}>
            Try another scent, note, or collection name.
          </p>
          <Link href="/products" className="text-primary uppercase tracking-widest font-semibold hover:text-secondary" style={{ fontFamily: dmSans, fontSize: "12px" }}>
            View All Products
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-16 gap-4">
          {page > 1 && (
            <Link
              href={`/products?page=${page - 1}${categoryQuery}${searchQuery}`}
              className="px-6 py-2 border border-outline-variant text-primary rounded-lg hover:bg-surface-variant transition-colors"
              style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/products?page=${page + 1}${categoryQuery}${searchQuery}`}
              className="px-6 py-2 border border-outline-variant text-primary rounded-lg hover:bg-surface-variant transition-colors"
              style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
            >
              Next
            </Link>
          )}
        </div>
      )}
    </>
  );
}

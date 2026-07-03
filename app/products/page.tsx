import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/repositories/product.repository";
import { ProductResultsClient } from "@/components/product/ProductResultsClient";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const categoryId = typeof resolvedParams.categoryId === "string" ? resolvedParams.categoryId : undefined;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search.trim() : "";
  const page = parseInt(typeof resolvedParams.page === "string" ? resolvedParams.page : "1") || 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  let products: any[] = [];
  let total = 0;
  let categories: any[] = [];

  try {
    const [productsResult, catsResult] = await Promise.all([
      getProducts({ categoryId, search: search || undefined, limit, offset }),
      getCategories(),
    ]);
    products = productsResult.products ?? [];
    total = productsResult.total ?? 0;
    categories = catsResult ?? [];
  } catch {}

  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";

  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto" style={{ paddingLeft: "80px", paddingRight: "80px", paddingTop: "48px", paddingBottom: "80px" }}>

        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 uppercase tracking-tight" style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.05em", color: "#454742" }}>
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>chevron_right</span></li>
            <li style={{ color: "#5e5e5c" }}>Fragrances</li>
          </ol>
        </nav>

        {/* Page Title */}
        <h1
          className="text-on-surface"
          style={{ fontFamily: playfair, fontSize: "64px", lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: 400, marginBottom: search ? "24px" : "120px" }}
        >
          {search ? `Search results for "${search}"` : "Fragrances"}
        </h1>

        {search && (
          <p className="text-on-surface-variant mb-16" style={{ fontFamily: dmSans, fontSize: "16px", lineHeight: "1.6" }}>
            Showing elegant fragrances matching your inquiry.
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 space-y-12">
            <div>
              <h3
                className="text-on-surface uppercase tracking-widest border-b border-secondary/10 pb-2 mb-6"
                style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
              >
                Category
              </h3>
              <div className="space-y-4">
                <Link
                  href={search ? `/products?search=${encodeURIComponent(search)}` : "/products"}
                  className="flex items-center gap-3 group"
                >
                  <span
                    className={`group-hover:text-primary transition-colors ${!categoryId ? "text-primary font-bold" : "text-on-surface-variant"}`}
                    style={{ fontFamily: dmSans, fontSize: "16px" }}
                  >
                    All Categories
                  </span>
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?categoryId=${cat.id}${searchQuery}`}
                    className="flex items-center gap-3 group"
                  >
                    <span
                      className={`group-hover:text-primary transition-colors ${categoryId === cat.id ? "text-primary font-bold" : "text-on-surface-variant"}`}
                      style={{ fontFamily: dmSans, fontSize: "16px" }}
                    >
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <ProductResultsClient
              initialData={{ products, total }}
              categoryId={categoryId}
              search={search}
              page={page}
              limit={limit}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

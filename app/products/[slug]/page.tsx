import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getProductBySlug } from "@/lib/repositories/product.repository";
import { notFound } from "next/navigation";
import { AddToCartClient } from "@/components/product/AddToCartClient";
import { ProductReviews } from "@/components/product/ProductReviews";
import { WishlistButton } from "@/components/product/WishlistButton";
import Link from "next/link";
import { getImageSrcSet, getOptimizedImageUrl } from "@/lib/image-url";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  let product: any = null;
  try {
    product = await getProductBySlug(slug);
  } catch {}

  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main
        className="max-w-[1280px] mx-auto"
        style={{ paddingLeft: "64px", paddingRight: "64px", paddingTop: "96px", paddingBottom: "64px", marginTop: "96px" }}
      >
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 uppercase" style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.05em", color: "#454742" }}>
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>chevron_right</span></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Fragrances</Link></li>
            <li><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>chevron_right</span></li>
            <li style={{ color: "#5e5e5c" }}>{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex gap-4 mb-4 overflow-x-auto snap-x hide-scrollbar">
              {product.imageUrls?.map((img: string, i: number) => (
                <div key={i} className="min-w-full aspect-[4/5] bg-surface-variant relative snap-center rounded overflow-hidden">
                  <img
                    src={getOptimizedImageUrl(img, { width: 1200 })}
                    srcSet={getImageSrcSet(img, [640, 960, 1200, 1600])}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    alt={`${product.name} - Image ${i+1}`}
                    className="w-full h-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  {i === 0 && (
                    <div className="absolute top-6 right-6">
                      <WishlistButton 
                        product={{
                          productId: product.id,
                          slug: product.slug,
                          name: product.name,
                          price: product.price,
                          imageUrl: product.imageUrls?.[0] || ""
                        }} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Thumbnails */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.imageUrls.map((url: string, i: number) => (
                  <button
                    key={i}
                    className="aspect-square rounded overflow-hidden opacity-60 hover:opacity-100 transition-opacity"
                    style={{ background: "#e9e2d5", outline: i === 0 ? "1px solid #5f5e5b" : "none" }}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={getOptimizedImageUrl(url, { width: 180, height: 180 })}
                      alt={`${product.name} ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-0">
            <div className="mb-4">
              <p
                className="uppercase tracking-[0.2em] text-on-surface-variant mb-2"
                style={{ fontFamily: dmSans, fontSize: "14px", letterSpacing: "0.2em", fontWeight: 500 }}
              >
                DailyMist
              </p>
              <h1
                className="text-on-surface mb-2 leading-tight"
                style={{ fontFamily: playfair, fontSize: "40px", lineHeight: "1.2", fontWeight: 500 }}
              >
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-secondary">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>star_half</span>
                  <span className="ml-2 text-on-surface-variant" style={{ fontFamily: dmSans, fontSize: "14px" }}>4.8/5</span>
                </div>
                <span className="text-outline-variant">|</span>
                <span
                  className="text-on-surface-variant underline underline-offset-4 cursor-pointer hover:text-primary"
                  style={{ fontFamily: dmSans, fontSize: "14px" }}
                >
                  124 Reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span style={{ fontFamily: playfair, fontSize: "28px", lineHeight: "36px", fontWeight: 400, color: "#1c1b1b" }}>
                ${product.price}
              </span>
            </div>

            {/* Description */}
            <p
              className="text-on-surface-variant leading-relaxed mb-8 italic"
              style={{ fontFamily: dmSans, fontSize: "18px", lineHeight: "1.6" }}
            >
              {product.description || '"A luminous fragrance that captures the ethereal clarity of daybreak. Crisp notes of green tea and bergamot unfold into a heart of white jasmine, leaving a trail as clean and delicate as morning mist on a silent lake."'}
            </p>

            <AddToCartClient product={product} />

            {/* Accordions */}
            <div style={{ borderTop: "1px solid #c8c7be" }}>
              {["Scent Notes", "Details", "Shipping & Returns"].map((section) => (
                <details key={section} className="group" style={{ borderBottom: "1px solid #c8c7be" }}>
                  <summary
                    className="flex justify-between items-center py-5 cursor-pointer list-none hover:text-primary transition-colors"
                    style={{ fontFamily: dmSans, fontSize: "14px", letterSpacing: "0.05em", fontWeight: 500 }}
                  >
                    <span className="uppercase tracking-widest text-on-surface">{section}</span>
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform duration-300">expand_more</span>
                  </summary>
                  <div className="pb-6" style={{ fontFamily: dmSans, fontSize: "16px", color: "#474741" }}>
                    {section === "Scent Notes" && (
                      <div className="space-y-4">
                        {[["Top", "Bergamot, Lemon Zest, Green Tea"], ["Heart", "White Jasmine, Lily of the Valley, Iris"], ["Base", "Sandalwood, Musk, White Cedar"]].map(([note, desc]) => (
                          <div key={note} className="flex justify-between border-b border-surface-container pb-2">
                            <span className="font-medium text-on-surface">{note}</span>
                            <span>{desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {section === "Details" && <p>Eau de Parfum. 50ml. Concentration: 20%. Longevity: 8–12 hours.</p>}
                    {section === "Shipping & Returns" && <p>Complimentary shipping on all orders over $150. Free returns within 30 days.</p>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews slug={slug} />
        
      </main>
      <Footer />
    </>
  );
}

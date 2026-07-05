import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { getProducts } from "@/lib/repositories/product.repository";
import { Reveal } from "@/components/ui/Reveal";
import { getImageSrcSet, getOptimizedImageUrl } from "@/lib/image-url";

export default async function HomePage() {
  let featuredProducts: any[] = [];
  try {
    const result = await getProducts({ isFeatured: true, limit: 4 });
    featuredProducts = result.products ?? [];
  } catch {}

  // fallback static products if DB empty
  const staticProducts = [
    {
      id: "1", slug: "velvet-cedar", name: "Velvet Cedar",
      price: 185, type: "Eau de Parfum",
      imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuALD3XYIOHXsiDvyGuewDp776PM78bP8iseAk1bd_dSynko-soWCfWeSICFX3ToIZIoOc6d6ZPfzolXkchi_ibvm9Cj2opLuGpSOz3pvJ2OZp2qPCYY_BSpXefWptsmGbSm1LBUn3rf2MJkvnBeC8gjKduNKNmpKdf0KudPEWFy7tGYtxBKRyVqJhw6rCA7Xx5GYtopsiT7pWDTA11a73BvsTXS6YbikXaRJXZzaYRymwbY9_INqZnQsg=s2048"]
    },
    {
      id: "2", slug: "morning-mist", name: "Morning Mist",
      price: 210, type: "Eau de Parfum",
      imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBdtKiqMUrSMNbhizfF_dVtQxZT783wpyJuz6Es_R53dmhjZHI_n3k6el-44fWEDbFfXUUwJ8OwuSU7s9kDjZ8LPAoirHD9NabjVRGLFEQKi1-8v1Q9mMU22BKyOifSSRvDCaooO9ZVn0-cZ0AcQyjRgxVM0pfctMrfzjJUSb8AD3UIR-wQ4KpWtiQ0Y1wx5Tk-67p_ZPKTUKP1t1w576-kcQdkFsyqN2p0uHvyU3QgeFJzcWnRvngQ0A=s2048"]
    },
    {
      id: "3", slug: "amber-silk", name: "Amber Silk",
      price: 145, type: "Perfume Oil",
      imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuApJcW4OPj0nKg0t0V2oBNuZIcn3E8EOp3fedbCphoqdiGRIEsGaWw08S3rFNx87eZ1vCQwdo2OFuOX6DMYnHJ5n7O0UHRXLflKPvkH_jxrCAOpOZRnjtUUf9Qj8hTbjpG4Pt6NmWoXhv9pfKf50U-XxqfAJ4uy3s3eDC_eNcj7DeRTV3BGxj01uJAj74-uw18v4u3XNAZpSw5CTjAnVv-EhSP_oAUuPNX_bKBXJTanQ4ZbrD_qIEelMQ=s2048"]
    },
    {
      id: "4", slug: "solstice-bloom", name: "Solstice Bloom",
      price: 160, type: "Eau de Toilette",
      imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuB4oVL-ipc0jOQiIv33MOuvAalaVGD6H7vjnWelBUZY0Qg_urFNTTPZIRYPiGUm71VzE_EXfsvk3knI9CibKH_Dl3x2hTe8w4ZlP8z5jlMaRaea1PZsm12MPe1BJ5hCaZMYivBPuDE3gZvX03EZCVEJLZmwk9G603Oy4iTuzj5VAXJ9mGlte32U7cCIDaOknQ5nVwN4WMki4vY7lWph3maL2GDRkh7IJuVNoXOVjsHFYTvUfRevCfy85Q=s2048"]
    },
  ];

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : staticProducts;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center animate-slow-pan"
              style={{
                backgroundImage: "url('/images/home-hero-perfume.jpg')",
              }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.6), transparent)" }} />
          </div>
          <div
            className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20"
          >
            <div className="max-w-2xl animate-fade-up">
              <span
                className="font-label-sm text-label-sm tracking-[0.3em] uppercase text-white/80 mb-6 block"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.3em", fontWeight: 500 }}
              >
                Collection I: The Dawn
              </span>
              <h2
                className="font-display-lg text-white mb-8 text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: 400 }}
              >
                Scenting your moments
              </h2>
              <p
                className="text-white/80 mb-10 max-w-lg animate-fade-up-delay"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", lineHeight: "1.6" }}
              >
                Capturing the ephemeral beauty of the morning mist in a bottle. Discover a sensory journey designed for the intentional soul.
              </p>
              <Link
                href="/products"
                className="inline-block px-10 py-5 rounded-full font-bold tracking-wider transition-all duration-500 luxury-shadow animate-fade-up-delay-2 hover:bg-white/20 hover:scale-105 group"
                style={{ 
                  fontFamily: "'DM Sans', sans-serif", 
                  fontSize: "16px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#ffffff"
                }}
              >
                Discover the Collection
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section
          className="max-w-[1440px] mx-auto py-16 md:py-32 px-4 md:px-10 lg:px-20"
        >
          <Reveal className="flex justify-between items-end mb-16">
            <div>
              <h3
                className="text-on-surface mb-2 text-2xl md:text-3xl"
                style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.3", fontWeight: 400 }}
              >
                Signature Essences
              </h3>
              <p className="text-on-surface-variant" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>
                Handcrafted in small batches using rare botanicals.
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
            >
              VIEW ALL
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 100}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group cursor-pointer block"
                >
                <div className="aspect-[4/5] bg-surface-container overflow-hidden rounded-xl mb-6">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={getOptimizedImageUrl((product.imageUrls && product.imageUrls[0]) || "https://placehold.co/400x500/f0eded/5e5e5c?text=DailyMist", { width: 960 })}
                    srcSet={getImageSrcSet((product.imageUrls && product.imageUrls[0]) || "https://placehold.co/400x500/f0eded/5e5e5c?text=DailyMist", [640, 960, 1280, 1600])}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    alt={product.name}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
                <h4
                  className="text-on-surface group-hover:text-primary transition-colors text-xl md:text-2xl"
                  style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.4", fontWeight: 400 }}
                >
                  {product.name}
                </h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-secondary" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>
                    {product.type ?? "Eau de Parfum"}
                  </span>
                  <span className="text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>
                    ${product.price}
                  </span>
                </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Shop by Category */}
        <section className="bg-surface-container-low py-16 md:py-32">
          <Reveal className="max-w-[1440px] mx-auto text-center px-4 md:px-10 lg:px-20">
            <h3
              className="text-on-surface mb-10 md:mb-16 italic text-2xl md:text-3xl"
              style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.3", fontWeight: 400 }}
            >
              Curated for Every Identity
            </h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-24">
              {[
                { label: "For Her", sub: "Floral & Grace", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdd4s6VH6kH379Ef1xTncxiUpRgRRiMN6slGDjF5MO-SwGRiD5vmvtRiXB1tR5A1_Hm1w86MyN9NYaPYR1SkKtTp245X7AtlreRsvLfx2zoGK3vV7U0GbfHkWrhNP6OInPwKb8GkJI2B5du4JlMh1hh8HnXRL8Ruw7TFgNZ0aDFporOAG4ZKA_7z2AJxqbEdxgS60JelwVSAi6sHExKalUgMs0ctgx_FKSi84OnqDSlfRae_VTJ1aKDg=s2048" },
                { label: "For Him", sub: "Woods & Spirit", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCT-9qn5J5kbOYf-S8GN1elhiCWKXasqh4WpUZML1VbwXuoChQuMY4kb-Hi-JNUdZ3LGP6ZUTYB0hCrWmIBSZFBJNW5CEKRuL8afAjX39oxHNNAGwHCalsFafD272IqEsfrdHl2X-vwh39DHrx9NKkZ7R6WlQ5ZC7iDTZWPlqzfiM9LkmEAQR1sg7If7YaGug7Q_NCUumz0hg_lEprwvzl2Wpq5-3vzHYLkrpp8Q_XUbmuh_Q1l3ubVVw=s2048" },
                { label: "For Everyone", sub: "Balanced & Bold", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQB4EHPXkJyYeZXqf5ym3FPndBba599q0mSUBtbdgsnbi7FYIRtEkILCcZLfY-vQ20jiJnhw-KlGQ7ypprJifLQPJS3Pifn3GrfXTotNLN1IE48ojB-TOYqMF04VYX_NUmeW7v1eBR1BoYFO32eK8GPgvWC5h1DT94cncQGvfqjD7SvUXjy8f0sQZM4j5Was3gX1Jm5ecHUvkoUsRU6N_jAcaPQTs1fvmmKXUifoZvVkB17J-4H3OfFw=s2048" },
              ].map((cat, i) => (
                <Reveal key={cat.label} delay={i * 150}>
                  <Link href="/products" className="group block max-w-[280px]">
                    <div className="relative w-64 h-64 mx-auto mb-8 overflow-hidden rounded-full border border-outline-variant p-2 group-hover:border-primary transition-colors duration-500">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          src={getOptimizedImageUrl(cat.img, { width: 420 })}
                          srcSet={getImageSrcSet(cat.img, [240, 420, 640])}
                          sizes="256px"
                          alt={cat.label}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <h5
                      className="text-on-surface mb-2 text-xl md:text-2xl"
                      style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.4", fontWeight: 400 }}
                    >
                      {cat.label}
                    </h5>
                    <p
                      className="text-secondary tracking-widest uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
                    >
                      {cat.sub}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Best Sellers */}
        <section className="py-16 md:py-24 px-4 md:px-10 lg:px-20">
          <Reveal className="max-w-[1440px] mx-auto mb-10">
            <h3
              className="text-on-surface text-2xl md:text-3xl"
              style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.3", fontWeight: 400 }}
            >
              The Alchemist&apos;s Selection
            </h3>
          </Reveal>
          <Reveal delay={200} className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { label: "Most Loved", name: "Arctic Iris", slug: "arctic-iris", price: 230, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzR_0B145zCTiIF9vk35JbfY8tQoGTDpp-tcm-BRDSI-8RQvCEO5_Xa7CGkyODfJNOdWZj5PzZZXbNXxQmUWuFwCrvPE-iIRBawExaG9U-YfwyInjXbDcs32VixLUciaBbS8TrjC1qaSA1bx3se86DIiIbWJKQQCFMxUyhFbQxtPPORpBgPWR8DwIWUp3Ixa60x6KanLHRpjvaX5Vn3MUAi1myFgLq-JyBPAdz-xb93Prf63oEW-5WYw=s2048" },
              { label: "Editor's Pick", name: "Night Oud", slug: "night-oud", price: 275, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_HiHkCea_QQGly1P5RpD4b3bz6r8yfgfPk1bOsqGJ1OGHYDlZxhObt4wFJ6KFsF8_dJc1c9kxZwnmPGoTPA77iNBFyJ6Z8obuBba2TFQf6Htr0nWyLh2jmVEnwvMjh_KQsqs0zdV9qc3LKwsqHlqo7MFx8D9y7c7zrU9kuQ28t-LXXB3D1xe811z9ULwHw_Rpg0qC7akkf-9V2V4s9fmxtzRdADLY-iSFPGFWo8-pdAcMuGZiD3-GBg=s2048" },
              { label: "Limited Release", name: "Nectarine Blush", slug: "nectarine-blush", price: 190, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi2nxNwpdoO1zQQzwkymcQpsgLlWhgPc9l2i-lxV747VyOZpzX5sCfhY2wjHc4CZht8pRmFk6Tp99vUG1FJEU_3s7-lsPcLS-VqKvlFiRxvvoF2mFgzTaVrhsYfC3DBP3XG5qjWoY9EdL-JbWhWlzNV2qw2gFKUWulslUp4EdXmV63RjooQXZvzNdlMvoPuR-Mj2BMiVe6o_s-THP_wH8mw0nk9sPkX_8EfbAR4qd6DHVIOyIeJxXViw=s2048" },
              { label: "New Arrival", name: "Moss & Rain", slug: "moss-and-rain", price: 155, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfIatRUEZmplQM9PMfa8m1B9dgSyYt-XAKFaw1M-Ln56q4X2FI0EU9Oa0G11datGUHByyINPPPDtHudxBt4fNlSQ0DS1Wglwr5J9BRhcPQhoN-yIcwmGpuZGOR7B9vsSdFumHUlg2XJpzdYENbZOueK9tcp0Ox0ovyiY9-uk0H1gDLQ09NhTzPcFSv3G4S5oB2qH3e0C9LPiDKurHmfkakzRrX3_jeQmIyWRfW8OKRx1iow6Z96991zQ=s2048" },
            ].map((item) => (
              <Link href={`/products/${item.slug}`} key={item.name} className="group cursor-pointer min-w-0">
                <div className="aspect-[4/5] bg-surface-container rounded-lg overflow-hidden mb-5 luxury-shadow">
                  <img
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                    src={getOptimizedImageUrl(item.img, { width: 960 })}
                    srcSet={getImageSrcSet(item.img, [640, 960, 1280, 1600])}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span
                  className="text-primary tracking-widest uppercase block mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
                >
                  {item.label}
                </span>
                <h4
                  className="text-on-surface group-hover:text-primary transition-colors text-xl md:text-2xl"
                  style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.4", fontWeight: 400 }}
                >
                  {item.name}
                </h4>
                <p className="text-secondary" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>
                  ${item.price}
                </p>
              </Link>
            ))}
          </Reveal>
        </section>

        {/* Newsletter */}
        <section className="py-16 md:py-32 px-4 md:px-10 lg:px-20">
          <Reveal
            className="max-w-4xl mx-auto rounded-xl text-center relative overflow-hidden py-10 md:py-20 px-6 md:px-10"
            style={{ background: "#f5ece9" }}
          >
            <div className="absolute top-0 left-0 w-32 h-32 blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ background: "rgba(252,249,248,0.5)" }} />
            <div className="absolute bottom-0 right-0 w-48 h-48 blur-3xl translate-x-1/3 translate-y-1/3" style={{ background: "rgba(94,94,92,0.1)" }} />
            <div className="relative z-10">
              <span
                className="text-primary tracking-[0.4em] uppercase mb-6 block"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.4em", fontWeight: 500 }}
              >
                Join the Circle
              </span>
              <h3
                className="text-on-surface mb-8 text-3xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "'Playfair Display', serif", lineHeight: "1.1", fontWeight: 400 }}
              >
                Receive scent notes <br />& exclusive releases
              </h3>
              <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
                <div className="flex-1 border-b border-primary/30 py-2">
                  <input
                    className="w-full bg-transparent border-none outline-none placeholder:text-outline p-2 text-center md:text-left"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
                    placeholder="Email Address"
                    type="email"
                  />
                </div>
                <button
                  className="bg-primary text-white px-8 py-3 rounded-lg font-bold tracking-widest hover:bg-secondary transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
                  type="button"
                >
                  SUBSCRIBE
                </button>
              </form>
              <p
                className="mt-8 text-secondary"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em" }}
              >
                By subscribing, you agree to our Privacy Policy and Terms of Service.
              </p>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}

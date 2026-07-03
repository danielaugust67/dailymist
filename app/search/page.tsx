import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export default function SearchPage() {
  const dummyResults = [
    {
      id: "1",
      slug: "midnight-oud",
      name: "Midnight Oud",
      price: 245,
      type: "Extrait de Parfum",
      description: "Notes of Agarwood, Saffron, and Incense.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKGedZ1ugqE4qAmxUEgf7tf3vIr7k8SMEY2VJajwkj23-An3xdEf-9_aL39hVR7gFjg2Fj4NYVcHH78SdxKLahDiYe-kQNUmzTEHG9PeXBoJDpJ3JDTrGI9OZfpuAGxrKeUSZLa-Ob0EmvUzpP3O6YOWNS0kLGKeVgJhtLtZJdrlZ4fLfl2iQCxJyeiU3QRgWO0G2SrKK_Fp-Pfa_GMAdwyNFOJptjDLx_EDOnlMUzTHWyeCDftzaAhw=s2048",
    },
    {
      id: "2",
      slug: "desert-mist",
      name: "Desert Mist",
      price: 180,
      type: "Eau de Parfum",
      description: "Sandalwood, Bergamot, and Silk Oud.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj_pIuidpRsSWjgd7MnjXr1b9ZokLQR6itlSfk12kOU6miZRTZZX7jRxieQYImWF9XGl1BlcGsXYrRLo1rP5aQJnHwFsHTJ87YTpECCX1ka24RbwkmDdxSXyX8k_c1heqC5pNQvXC6RsLNtizk9roTpEb1zpjQZlBdT3Iueva_PfXDlb3PsS4QwWypyf-DqOPW5zeKSFRGUoYTnl-MfbHlqJgbt4Zclh-v6tH3JM3R5uEb1sF32UyEIQ=s2048",
    },
    {
      id: "3",
      slug: "sacred-resin",
      name: "Sacred Resin",
      price: 310,
      type: "Oud Collection",
      description: "Pure Cambodian Oud and White Musk.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbdU6hgfUPsjj598tYTvVsal9VKLReCE-NGUjvHUbbYfKa9mkkKRUa9wvzKzQ-dxkRyvtRpHWCk-rsz_5DFUHm87Nw-EAKM1jG-Sdk3Qm4uetNk7Yg_8LHa4PfYrGoT96wYVJhCU7LX-JEobxllr90-irCkZt0g4vQrMENBy-YmY9N3qCsKlPj5FdrXkJIreen1hU7aSjvb0x434ojOECeNbn8NNVlXYNUD9SZBXXS7ZfcXh-5ZQSn0g=s2048",
    },
    {
      id: "4",
      slug: "velvet-oud",
      name: "Velvet Oud",
      price: 215,
      type: "Eau de Parfum",
      description: "Leather, Tobacco Leaf, and Oud.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtfKCrhGH0thMMEoCzZaCy_uEENyEbzQlN_SdTRugzq5KDB-oj5EfwnYuWpPSm9_Z_s8EKuJoDXJju0n60YU6sdV9Gonx2Ihy3Oo3rf6hGma4N_jGC71S6NCNf3WEtniXPgSDXcEQFNLVHwimG3wkxKg-bbKCvRSXFNZeLoqznu-asX0mhB9R_K8vlWAiZKjfEMEC_6fMzFdhL9dOncH4O7c4rgZajDxpBLN_lu5uhgnmxDH0QP9FvcA=s2048",
    },
    {
      id: "5",
      slug: "azure-oud",
      name: "Azure Oud",
      price: 260,
      type: "Exclusive",
      description: "Sea Salt, Driftwood, and Oud.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWLXzJDD7DWz3qavrj-MFYNgZH0GgBuDu8-BsXspmKObjuJ-1ZzN9hzLYWCJbFTXf-lErvQVAXT26p3PRn7yHfgH5Q7H1N2NvC4DVydAmCsG25tuK_mTdz3rw3pA9Kz1tWjetyKr1ZON4ye8D_JRJb4L-taJxFEoqE7IIbTZz95qRKuUkTk6-tmt8m7EiNLqpGcYk_XbbuYnHP6WT8PGkFS2GD-khgHNh3tj9Zsjt06JH2hXuz6ejmGw=s2048",
    },
    {
      id: "6",
      slug: "golden-amber-oud",
      name: "Golden Amber Oud",
      price: 295,
      type: "Extrait de Parfum",
      description: "Amber, Vanilla, and Royal Oud.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX1cgyZwDuyf9r162MrOz4PKecEc1VaejCLVD0IGsF93htYW0l5K6nstCqRewUiH44vLn4O6XM6RVh7KqhrPsrh61qkdc344CzKwuqMXkWs9ZjJuQR2LmJEMag2ouLTga2UqQbCDbJViAyoiWQpRYfhWo6CydMETKdZ97INmJQwlfMmXTeVFVRwJ9S5zYORKhxppU_fPxCw0JUCnXvjedeoiTGwdsP7Sd6zK5nzZVPAwAmev-_r4dHnw=s2048",
    },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-secondary-fixed-dim/30">
      <Navbar />
      
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-[80px] py-12">
        {/* Search Header */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-6xl text-on-surface mb-4 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            Search results for 'Oud'
          </h1>
          <p className="text-on-surface-variant text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Showing 6 elegant fragrances matching your inquiry.
          </p>
        </section>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left Sidebar Filter */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-on-surface mb-4 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Categories
                </h3>
                <ul className="space-y-3">
                  <li>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-on-surface-variant group-hover:text-primary transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Extrait de Parfum</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" defaultChecked />
                      <span className="text-on-surface-variant group-hover:text-primary transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Eau de Parfum</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-on-surface-variant group-hover:text-primary transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>Oils & Attars</span>
                    </label>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-on-surface mb-4 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Odor Profile
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-xs cursor-pointer hover:bg-outline-variant transition-colors">Smoky</span>
                  <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-xs cursor-pointer hover:bg-outline-variant transition-colors">Woody</span>
                  <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-xs cursor-pointer hover:bg-outline-variant transition-colors">Spicy</span>
                  <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-xs cursor-pointer hover:bg-outline-variant transition-colors">Oriental</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-on-surface mb-4 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Price Range
                </h3>
                <input className="w-full h-1 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary" type="range" />
                <div className="flex justify-between mt-2 text-xs text-on-surface-variant" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span>$50</span>
                  <span>$500+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Section */}
          <section className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-outline-variant/30 gap-4">
              <span className="text-on-surface-variant" style={{ fontFamily: "'DM Sans', sans-serif" }}>6 items found</span>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase text-on-surface-variant" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sort By:</span>
                <select className="bg-transparent border-none text-on-surface focus:ring-0 cursor-pointer outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <option>Featured</option>
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              {dummyResults.map((product, i) => (
                <Reveal key={product.id} delay={i * 100}>
                  <div className="group cursor-pointer">
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="aspect-[4/5] overflow-hidden bg-surface-container rounded-xl relative mb-6">
                        <div 
                          className="w-full h-full transition-transform duration-700 group-hover:scale-105 bg-cover bg-center"
                          style={{ backgroundImage: `url('${product.image}')` }}
                        />
                        <div className="absolute top-4 right-4 z-10" onClick={(e) => e.preventDefault()}>
                          <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-on-surface hover:text-red-500">
                            <span className="material-symbols-outlined">favorite</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-primary uppercase tracking-widest mb-1 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {product.type}
                      </p>
                      <h3 className="text-2xl text-on-surface mb-2 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {product.name}
                      </h3>
                      <p className="text-on-surface-variant mb-3 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {product.description}
                      </p>
                      <p className="text-on-surface font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        ${product.price.toFixed(2)}
                      </p>
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 pt-8 flex justify-center items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary rounded-full transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="flex items-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <button className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold rounded-full">1</button>
                <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">2</button>
                <span className="px-2 text-on-surface-variant">...</span>
                <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">4</button>
              </div>
              <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary rounded-full transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

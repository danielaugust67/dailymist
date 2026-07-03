import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Our Story | DailyMist",
  description: "The heritage and craftsmanship behind DailyMist luxury fragrances.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center animate-slow-pan"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBdtKiqMUrSMNbhizfF_dVtQxZT783wpyJuz6Es_R53dmhjZHI_n3k6el-44fWEDbFfXUUwJ8OwuSU7s9kDjZ8LPAoirHD9NabjVRGLFEQKi1-8v1Q9mMU22BKyOifSSRvDCaooO9ZVn0-cZ0AcQyjRgxVM0pfctMrfzjJUSb8AD3UIR-wQ4KpWtiQ0Y1wx5Tk-67p_ZPKTUKP1t1w576-kcQdkFsyqN2p0uHvyU3QgeFJzcWnRvngQ0A')",
              }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 md:px-[80px] text-center">
            <h1 className="font-display-lg text-white mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "64px" }}>
              The Essence of Time
            </h1>
            <p className="text-white/90 max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px" }}>
              Crafting memories through the art of perfumery since 2010.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-3xl mx-auto py-24 px-8 text-center space-y-8 text-on-surface" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", lineHeight: "1.8" }}>
          <p>
            At DailyMist, we believe that a fragrance is more than just a scent—it is an invisible garment, a lingering memory, and a quiet statement of identity. Our journey began in a small atelier, where our founders sought to capture the fleeting beauty of the morning mist in a bottle.
          </p>
          <p>
            Every bottle is handcrafted in small batches using rare, ethically sourced botanicals from around the world. We collaborate with master perfumers to weave together complex notes that evolve beautifully on the skin, telling a different story for every wearer.
          </p>
          <p className="font-medium pt-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px" }}>
            "Scenting your moments, beautifully."
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

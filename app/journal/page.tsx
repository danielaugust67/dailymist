import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = {
  title: "Journal | DailyMist",
  description: "Read our latest articles on perfumery, lifestyle, and scent curation.",
};

export default function JournalPage() {
  const articles = [
    {
      id: 1,
      title: "The Art of Layering Fragrances",
      category: "Perfumery Guide",
      date: "October 12, 2023",
      excerpt: "Discover how to combine different scent notes to create a personalized olfactory signature that lasts all day.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALD3XYIOHXsiDvyGuewDp776PM78bP8iseAk1bd_dSynko-soWCfWeSICFX3ToIZIoOc6d6ZPfzolXkchi_ibvm9Cj2opLuGpSOz3pvJ2OZp2qPCYY_BSpXefWptsmGbSm1LBUn3rf2MJkvnBeC8gjKduNKNmpKdf0KudPEWFy7tGYtxBKRyVqJhw6rCA7Xx5GYtopsiT7pWDTA11a73BvsTXS6YbikXaRJXZzaYRymwbY9_INqZnQsg"
    },
    {
      id: 2,
      title: "Understanding Oud: The Liquid Gold",
      category: "Ingredients",
      date: "September 28, 2023",
      excerpt: "Delve into the history and extraction process of one of the world's most expensive and complex fragrance ingredients.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQB4EHPXkJyYeZXqf5ym3FPndBba599q0mSUBtbdgsnbi7FYIRtEkILCcZLfY-vQ20jiJnhw-KlGQ7ypprJifLQPJS3Pifn3GrfXTotNLN1IE48ojB-TOYqMF04VYX_NUmeW7v1eBR1BoYFO32eK8GPgvWC5h1DT94cncQGvfqjD7SvUXjy8f0sQZM4j5Was3gX1Jm5ecHUvkoUsRU6N_jAcaPQTs1fvmmKXUifoZvVkB17J-4H3OfFw"
    },
    {
      id: 3,
      title: "Transitioning Your Scent for Fall",
      category: "Lifestyle",
      date: "September 05, 2023",
      excerpt: "As the weather cools down, learn which warm, woody, and spicy notes are perfect for your autumn wardrobe.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCT-9qn5J5kbOYf-S8GN1elhiCWKXasqh4WpUZML1VbwXuoChQuMY4kb-Hi-JNUdZ3LGP6ZUTYB0hCrWmIBSZFBJNW5CEKRuL8afAjX39oxHNNAGwHCalsFafD272IqEsfrdHl2X-vwh39DHrx9NKkZ7R6WlQ5ZC7iDTZWPlqzfiM9LkmEAQR1sg7If7YaGug7Q_NCUumz0hg_lEprwvzl2Wpq5-3vzHYLkrpp8Q_XUbmuh_Q1l3ubVVw"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface py-24">
        <div className="max-w-[1440px] mx-auto px-8 md:px-[80px]">
          <div className="mb-20 text-center">
            <h1 className="font-display-lg text-on-surface mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "56px" }}>
              The Journal
            </h1>
            <p className="text-secondary max-w-lg mx-auto" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px" }}>
              Notes on scent, lifestyle, and the quiet luxury of everyday moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {articles.map((article) => (
              <article key={article.id} className="group cursor-pointer flex flex-col">
                <div className="w-full aspect-square bg-surface-container rounded-xl overflow-hidden mb-6 luxury-shadow">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <div className="flex justify-between items-center mb-3 text-xs uppercase tracking-widest font-semibold text-secondary">
                    <span>{article.category}</span>
                    <span>{article.date}</span>
                  </div>
                  <h2 className="text-2xl mb-4 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {article.title}
                  </h2>
                  <p className="text-on-surface-variant mb-6 leading-relaxed flex-1">
                    {article.excerpt}
                  </p>
                  <Link href="/journal" className="inline-block mt-auto text-sm font-semibold uppercase tracking-widest border-b border-on-surface w-fit pb-1 hover:text-primary hover:border-primary transition-colors">
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

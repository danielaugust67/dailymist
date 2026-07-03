import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Boutiques | DailyMist",
  description: "Visit our physical locations to experience the fragrances in person.",
};

export default function LocationsPage() {
  const locations = [
    {
      city: "Jakarta",
      name: "Senayan City Boutique",
      address: "Ground Floor, Senayan City Mall\nJl. Asia Afrika Lot 19\nJakarta Pusat, 10270",
      hours: "Monday - Sunday: 10:00 AM - 10:00 PM",
      phone: "+62 21 555 0192",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdd4s6VH6kH379Ef1xTncxiUpRgRRiMN6slGDjF5MO-SwGRiD5vmvtRiXB1tR5A1_Hm1w86MyN9NYaPYR1SkKtTp245X7AtlreRsvLfx2zoGK3vV7U0GbfHkWrhNP6OInPwKb8GkJI2B5du4JlMh1hh8HnXRL8Ruw7TFgNZ0aDFporOAG4ZKA_7z2AJxqbEdxgS60JelwVSAi6sHExKalUgMs0ctgx_FKSi84OnqDSlfRae_VTJ1aKDg"
    },
    {
      city: "Bali",
      name: "Seminyak Atelier",
      address: "Jl. Kayu Aya No. 8\nSeminyak, Kuta\nBali, 80361",
      hours: "Monday - Sunday: 09:00 AM - 09:00 PM",
      phone: "+62 361 555 9931",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5ixOq1cQ-H6O9kCZl88G6fU6vR337xFnYJqQMhXBbgk5MRB7dkuOliPYYqrH5KXEnfzeONoCJ76751mYUoXACkOAHU_eHima-AnzG6_guBTibCW_G7x1wfWUWYUMFt7IOsXQwaWP_REjaMOkU5ut7U4DGzNfU1MnMosIGu8zRQQfYgzDj9aFp28u83hnAJDtMBy-mfWVBf0Cz51BZCfQ8ItyI8dOuukXl-doye7bFq6J0Gihn_9sH4g"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-container-low py-24">
        <div className="max-w-[1440px] mx-auto px-8 md:px-[80px]">
          <div className="text-center mb-20">
            <h1 className="font-display-lg text-on-surface mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "56px" }}>
              Our Boutiques
            </h1>
            <p className="text-secondary max-w-lg mx-auto" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>
              Step into our olfactory havens. Experience the notes, consult with our scent specialists, and find your signature fragrance.
            </p>
          </div>

          <div className="space-y-24">
            {locations.map((loc, index) => (
              <div key={loc.city} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2 aspect-[4/3] overflow-hidden rounded-xl">
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="w-full lg:w-1/2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="uppercase tracking-widest text-xs font-semibold text-primary mb-4 block">{loc.city}</span>
                  <h2 className="text-4xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{loc.name}</h2>
                  <div className="space-y-4 text-on-surface-variant text-lg">
                    <p className="whitespace-pre-line leading-relaxed">{loc.address}</p>
                    <p className="pt-4 border-t border-outline-variant/30">{loc.hours}</p>
                    <p>{loc.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

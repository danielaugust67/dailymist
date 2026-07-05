import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low py-16 md:pt-32 md:pb-8">
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-[1440px] mx-auto gap-10 lg:gap-6 px-4 md:px-10 lg:px-20"
      >
        <div className="col-span-1">
          <h2
            className="text-on-surface mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", lineHeight: "1.3", fontWeight: 400 }}
          >
            DailyMist
          </h2>
          <p
            className="text-on-surface-variant mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: "1.6" }}
          >
            Redefining luxury through sensory intentionality and minimalist design.
          </p>
          <div className="flex gap-4">
            {["public", "camera", "video_library"].map((icon) => (
              <a key={icon} className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h6
            className="text-secondary tracking-widest uppercase mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
          >
            Collections
          </h6>
          <ul className="space-y-3">
            {["The Dawn Series", "Dusk Collection", "Botanical Oils", "Home Fragrance"].map((item) => (
              <li key={item}>
                <Link
                  href="/products"
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h6
            className="text-secondary tracking-widest uppercase mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
          >
            Customer Care
          </h6>
          <ul className="space-y-3">
            {["Shipping & Returns", "Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h6
            className="text-secondary tracking-widest uppercase mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
          >
            Newsletter
          </h6>
          <p className="text-on-surface-variant mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>
            Stay updated on our latest creations.
          </p>
          <div className="flex border-b border-outline py-2">
            <input
              className="bg-transparent border-none outline-none w-full"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
              placeholder="Your email"
              type="text"
            />
            <button className="material-symbols-outlined text-primary">arrow_forward</button>
          </div>
        </div>
      </div>

      <div
        className="max-w-[1440px] mx-auto mt-16 md:mt-20 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-10 lg:px-20"
      >
        <span className="text-on-surface-variant" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}>
          © 2024 DailyMist. All rights reserved.
        </span>
        <div className="flex gap-8">
          <span
            className="text-outline-variant uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
          >
            EST. 2024
          </span>
          <span
            className="text-outline-variant uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
          >
            JAKARTA
          </span>
        </div>
      </div>
    </footer>
  );
}

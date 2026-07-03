"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const payload = await res.json();
        if (!payload.success || !payload.data) {
          router.push("/login");
          return;
        }
        setUser(payload.data);
      } catch (error) {
        console.error(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <div className="flex flex-1 max-w-[1440px] w-full mx-auto pt-24">
        {/* SideNavBar */}
        <aside className="w-64 hidden md:block pt-8 border-r border-outline-variant/30">
          <div className="flex flex-col gap-4 py-8 px-6">
            <div className="mb-8 px-2">
              <h2 className="text-2xl text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Account
              </h2>
              <p className="text-xs text-on-surface-variant mt-1 tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Managing your luxury experience
              </p>
            </div>

            <nav className="flex flex-col gap-1">
              <Link href="/account" className="flex items-center gap-3 py-3 px-4 rounded-lg text-primary font-bold border-r-2 border-primary bg-surface-variant/30 transition-all duration-200">
                <span className="material-symbols-outlined">person</span>
                <span className="font-body-md text-body-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>Profile</span>
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 py-3 px-4 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-200">
                <span className="material-symbols-outlined">history</span>
                <span className="font-body-md text-body-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>Order History</span>
              </Link>
              <Link href="/account/addresses" className="flex items-center gap-3 py-3 px-4 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-200">
                <span className="material-symbols-outlined">location_on</span>
                <span className="font-body-md text-body-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>Addresses</span>
              </Link>
              <Link href="/account/wishlist" className="flex items-center gap-3 py-3 px-4 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-200">
                <span className="material-symbols-outlined">favorite</span>
                <span className="font-body-md text-body-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>Wishlist</span>
              </Link>
              <Link href="/account/settings" className="flex items-center gap-3 py-3 px-4 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-200">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-body-md text-body-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>Settings</span>
              </Link>
            </nav>

            <div className="mt-12 pb-12 px-2">
              <button onClick={handleLogout} className="flex items-center gap-3 text-red-700 hover:opacity-70 transition-opacity">
                <span className="material-symbols-outlined">logout</span>
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 md:px-[80px] py-12">
          <section className="max-w-3xl mx-auto">
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl text-on-background mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Profile Details
              </h1>
              <p className="text-lg text-on-surface-variant opacity-80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Refine your personal information and preferences to enhance your sensory journey with DailyMist.
              </p>
            </header>

            {/* Avatar Section */}
            <div className="flex items-center gap-8 mb-16 p-8 bg-white rounded-xl shadow-[0_10px_40px_rgba(74,62,62,0.04)]">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-variant">
                  <img
                    className="w-full h-full object-cover grayscale-[30%]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMRz57AyHd6gHy-ZhVKX8bigISD8xsaQpCy1SBdef97oB1doHBwvAEiGU1uCAzXLuUEmzJ7faFRpwqRtYZ-YiqoIOwcFnwMbWGilqUyJZ5E-ZNO1TA3TghyJz2x2LDJnaVN7xEVj8tasLAg9zEWHx-Y52YGPlRUGhR2o8f0FIEyE0819iby78rhO7DXoXslHwdtTrEs8N1fpmKuK7GN-H_wWhfxsMIpb3n3tLTGuCoBJ56gxZWn-D3WA=s2048"
                    alt="Profile Avatar"
                  />
                </div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                  <span className="material-symbols-outlined text-white text-2xl">edit</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl text-primary mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {user?.name || "Member"}
                </h3>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {user?.labels?.includes("admin") ? "Administrator" : "Platinum Member"}
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {/* Full Name */}
                <div className="relative border-b border-outline py-2 group">
                  <label className="absolute top-0 text-xs text-outline-variant uppercase transition-all" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px" }}>
                    Full Name
                  </label>
                  <input
                    className="block w-full bg-transparent border-none focus:ring-0 p-0 pt-4 font-body-md text-on-surface outline-none"
                    id="full_name"
                    type="text"
                    defaultValue={user?.name || ""}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Email Address */}
                <div className="relative border-b border-outline py-2 group">
                  <label className="absolute top-0 text-xs text-outline-variant uppercase transition-all" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px" }}>
                    Email Address
                  </label>
                  <input
                    className="block w-full bg-transparent border-none focus:ring-0 p-0 pt-4 font-body-md text-on-surface outline-none"
                    id="email"
                    type="email"
                    disabled
                    defaultValue={user?.email || ""}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Phone Number */}
                <div className="relative border-b border-outline py-2 group">
                  <label className="absolute top-0 text-xs text-outline-variant uppercase transition-all" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px" }}>
                    Phone Number
                  </label>
                  <input
                    className="block w-full bg-transparent border-none focus:ring-0 p-0 pt-4 font-body-md text-on-surface outline-none"
                    id="phone"
                    type="tel"
                    defaultValue={user?.phone || ""}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Birthday */}
                <div className="relative border-b border-outline py-2 group">
                  <label className="absolute top-0 text-xs text-outline-variant uppercase transition-all" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px" }}>
                    Date of Birth
                  </label>
                  <input
                    className="block w-full bg-transparent border-none focus:ring-0 p-0 pt-4 font-body-md text-on-surface outline-none"
                    id="birthday"
                    type="text"
                    placeholder="DD/MM/YYYY"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-6 pt-12 border-t border-outline-variant/30">
                <button
                  className="bg-primary text-white px-10 py-4 font-bold hover:bg-on-surface transition-colors shadow-lg"
                  type="submit"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Save Changes
                </button>
                <button
                  className="border border-outline px-10 py-4 text-primary hover:bg-surface-variant transition-colors"
                  type="button"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Discard
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}

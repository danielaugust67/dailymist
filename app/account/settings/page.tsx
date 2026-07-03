"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

export default function SettingsPage() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [productNotes, setProductNotes] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5]">
      <Navbar />

      <main className="flex-1 max-w-[1280px] mx-auto w-full flex gap-12" style={{ padding: "96px 64px" }}>
        <aside className="w-64 shrink-0 space-y-4">
          <h2 className="mb-8" style={{ fontFamily: playfair, fontSize: "28px" }}>My Account</h2>
          <nav className="space-y-4" style={{ fontFamily: dmSans, fontSize: "16px" }}>
            <Link href="/account" className="block text-on-surface-variant hover:text-primary transition-colors">Profile</Link>
            <Link href="/account/orders" className="block text-on-surface-variant hover:text-primary transition-colors">Order History</Link>
            <Link href="/account/addresses" className="block text-on-surface-variant hover:text-primary transition-colors">Addresses</Link>
            <Link href="/account/wishlist" className="block text-on-surface-variant hover:text-primary transition-colors">Wishlist</Link>
            <Link href="/account/settings" className="block text-primary font-medium border-b border-primary w-fit pb-1">Settings</Link>
          </nav>
        </aside>

        <div className="flex-1">
          <h1 className="mb-4" style={{ fontFamily: playfair, fontSize: "40px" }}>Settings</h1>
          <p className="text-on-surface-variant mb-12 max-w-2xl" style={{ fontFamily: dmSans }}>
            Manage your account preferences, notifications, and privacy options.
          </p>

          <div className="space-y-6">
            <section className="bg-white rounded-xl border border-outline-variant/30 p-8 shadow-sm">
              <h2 className="mb-6" style={{ fontFamily: playfair, fontSize: "24px" }}>Notifications</h2>
              <div className="space-y-5" style={{ fontFamily: dmSans }}>
                <label className="flex items-center justify-between gap-6 border-b border-outline-variant/20 pb-5">
                  <span>
                    <span className="block font-medium">Email updates</span>
                    <span className="block text-sm text-on-surface-variant">Receive DailyMist news and member notes.</span>
                  </span>
                  <input type="checkbox" checked={emailUpdates} onChange={(event) => setEmailUpdates(event.target.checked)} className="h-5 w-5" />
                </label>
                <label className="flex items-center justify-between gap-6 border-b border-outline-variant/20 pb-5">
                  <span>
                    <span className="block font-medium">Order alerts</span>
                    <span className="block text-sm text-on-surface-variant">Get notified when your order status changes.</span>
                  </span>
                  <input type="checkbox" checked={orderAlerts} onChange={(event) => setOrderAlerts(event.target.checked)} className="h-5 w-5" />
                </label>
                <label className="flex items-center justify-between gap-6">
                  <span>
                    <span className="block font-medium">Product notes</span>
                    <span className="block text-sm text-on-surface-variant">Hear about restocks and fragrance launches.</span>
                  </span>
                  <input type="checkbox" checked={productNotes} onChange={(event) => setProductNotes(event.target.checked)} className="h-5 w-5" />
                </label>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-outline-variant/30 p-8 shadow-sm">
              <h2 className="mb-6" style={{ fontFamily: playfair, fontSize: "24px" }}>Security</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(event) => event.preventDefault()} style={{ fontFamily: dmSans }}>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Current Password</label>
                  <input type="password" className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">New Password</label>
                  <input type="password" className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary" />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="bg-[#1b1c1c] text-white px-8 py-3 rounded-lg uppercase tracking-widest text-xs font-semibold hover:opacity-90 transition-opacity">
                    Save Settings
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

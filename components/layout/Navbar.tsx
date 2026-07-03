"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cart-store";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announce Bar */}
      <div className="bg-accent-soft-blush py-2 text-center w-full z-50 relative">
        <span
          className="font-label-sm text-label-sm tracking-[0.2em] uppercase text-secondary"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Complimentary shipping on orders over $150
        </span>
      </div>

      {/* Navigation — matches stitch-homepage.html nav exactly */}
      <nav
        ref={navRef}
        className={`sticky top-0 w-full z-40 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "shadow-[0_4px_30px_rgba(74,62,62,0.08)] bg-[rgba(252,249,248,0.85)]"
            : "bg-[rgba(252,249,248,0.85)]"
        }`}
        style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <div
          className="flex justify-between items-center py-6 max-w-[1440px] mx-auto"
          style={{ paddingLeft: "80px", paddingRight: "80px" }}
        >
          {/* Left Nav Links */}
          <div className="flex-1 flex gap-8">
            <Link
              href="/products"
              className="relative z-50 cursor-pointer font-body-md text-body-md tracking-wide text-primary border-b border-primary pb-1 transition-colors duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="relative z-50 cursor-pointer font-body-md text-body-md tracking-wide text-on-surface-variant hover:text-primary transition-colors duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              About
            </Link>
            <Link
              href="/locations"
              className="relative z-50 cursor-pointer font-body-md text-body-md tracking-wide text-on-surface-variant hover:text-primary transition-colors duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Locations
            </Link>
            <Link
              href="/journal"
              className="relative z-50 cursor-pointer font-body-md text-body-md tracking-wide text-on-surface-variant hover:text-primary transition-colors duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Journal
            </Link>
          </div>

          {/* Center Logo */}
          <div className="flex-none">
            <Link href="/" className="flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="DailyMist" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex-1 flex justify-end gap-6 items-center relative z-50">
            <Link href="/search" className="relative z-50 cursor-pointer hover:text-primary transition-colors duration-300 text-on-surface">
              <span className="material-symbols-outlined">search</span>
            </Link>
            <Link href="/account" className="relative z-50 cursor-pointer hover:text-primary transition-colors duration-300 text-on-surface">
              <span className="material-symbols-outlined">person</span>
            </Link>
            <Link href="/cart" className="relative z-50 cursor-pointer hover:text-primary transition-colors duration-300 text-on-surface">
              <span className="material-symbols-outlined">shopping_bag</span>
              <span
                className="absolute -top-1.5 -right-1.5 bg-primary text-white flex items-center justify-center rounded-full"
                style={{ width: "16px", height: "16px", fontSize: "9px", lineHeight: "1" }}
              >
                {mounted ? cartCount : 0}
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

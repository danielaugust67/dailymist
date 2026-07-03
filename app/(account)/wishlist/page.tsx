"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useWishlistStore, type WishlistItem } from "@/store/wishlist-store";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { CartToast } from "@/components/ui/CartToast";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const [toastProductName, setToastProductName] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isToastVisible) return;

    const timeout = window.setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [isToastVisible]);

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: 1,
      size: "50ml", // default size
    });
    setToastProductName(item.name);
    setIsToastVisible(true);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5]">
      <Navbar />
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full flex gap-12" style={{ padding: "96px 64px" }}>
        
        {/* Account Sidebar */}
        <aside className="w-64 shrink-0 space-y-4">
          <h2 className="mb-8" style={{ fontFamily: playfair, fontSize: "28px" }}>My Account</h2>
          <nav className="space-y-4" style={{ fontFamily: dmSans, fontSize: "16px" }}>
            <Link href="/account" className="block text-on-surface-variant hover:text-primary transition-colors">Profile</Link>
            <Link href="/account/orders" className="block text-on-surface-variant hover:text-primary transition-colors">Order History</Link>
            <Link href="/account/addresses" className="block text-on-surface-variant hover:text-primary transition-colors">Addresses</Link>
            <Link href="/account/wishlist" className="block text-primary font-medium border-b border-primary w-fit pb-1">Wishlist</Link>
            <Link href="/account/settings" className="block text-on-surface-variant hover:text-primary transition-colors">Settings</Link>
            <button className="block text-on-surface-variant hover:text-red-600 transition-colors mt-8">Log Out</button>
          </nav>
        </aside>

        <div className="flex-1">
          <h1 className="mb-12" style={{ fontFamily: playfair, fontSize: "40px" }}>My Wishlist</h1>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-outline-variant/30">
              <p className="text-on-surface-variant mb-6" style={{ fontFamily: dmSans }}>Your wishlist is empty.</p>
              <Link href="/products" className="underline font-medium text-primary">Discover Fragrances</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <div key={item.productId} className="bg-white rounded-xl border border-outline-variant/30 p-4 shadow-sm group">
                  <div className="relative aspect-[4/5] bg-[#e9e2d5] rounded-lg overflow-hidden mb-4">
                    <Link href={`/products/${item.slug}`}>
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-on-surface-variant hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                  
                  <Link href={`/products/${item.slug}`} className="block">
                    <h3 className="font-semibold text-lg mb-1" style={{ fontFamily: playfair }}>{item.name}</h3>
                  </Link>
                  <p className="text-on-surface-variant font-medium mb-4" style={{ fontFamily: dmSans }}>${item.price.toFixed(2)}</p>
                  
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-2 bg-white border border-[#1b1c1c] text-[#1b1c1c] rounded uppercase tracking-widest text-xs font-semibold hover:bg-[#1b1c1c] hover:text-white transition-colors"
                    style={{ fontFamily: dmSans }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CartToast
        isVisible={isToastVisible}
        productName={toastProductName}
        onClose={() => setIsToastVisible(false)}
      />

      <Footer />
    </div>
  );
}

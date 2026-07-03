"use client";

import { useWishlistStore, WishlistItem } from "@/store/wishlist-store";
import { useEffect, useState } from "react";

export function WishlistButton({ product }: { product: WishlistItem }) {
  const [mounted, setMounted] = useState(false);
  const { hasItem, addItem, removeItem } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40 backdrop-blur-md">
      <span className="material-symbols-outlined text-outline-variant">favorite</span>
    </button>
  );

  const isWished = hasItem(product.productId);

  const toggleWishlist = () => {
    if (isWished) {
      removeItem(product.productId);
    } else {
      addItem(product);
    }
  };

  return (
    <button 
      onClick={toggleWishlist}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        isWished ? 'text-red-500 bg-white shadow-sm' : 'text-primary bg-white/40 backdrop-blur-md hover:bg-white/80'
      }`}
    >
      <span className="material-symbols-outlined" style={{ fontVariationSettings: isWished ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
    </button>
  );
}

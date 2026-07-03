"use client";

import { useCartStore } from "@/store/cart-store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalPrice = useCartStore((state) => state.totalPrice());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-[1280px] mx-auto py-24 px-16">
           <h1 className="text-4xl" style={{ fontFamily: playfair }}>Shopping Cart</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5]">
      <Navbar />
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full" style={{ padding: "96px 64px" }}>
        <h1 
          className="text-on-surface mb-12"
          style={{ fontFamily: playfair, fontSize: "48px", fontWeight: 400 }}
        >
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 border-t border-outline-variant/30">
            <p className="text-on-surface-variant mb-8" style={{ fontFamily: dmSans, fontSize: "18px" }}>
              Your cart is currently empty.
            </p>
            <Link 
              href="/products"
              className="inline-block bg-[#1b1c1c] text-white px-8 py-4 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity"
              style={{ fontFamily: dmSans, fontSize: "12px", fontWeight: 600 }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-8">
              <div className="border-b border-outline-variant/30 pb-4 flex text-on-surface-variant uppercase tracking-widest" style={{ fontFamily: dmSans, fontSize: "12px", fontWeight: 600 }}>
                <div className="flex-1">Product</div>
                <div className="w-32 text-center">Quantity</div>
                <div className="w-32 text-right">Total</div>
              </div>

              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex items-center gap-6 py-6 border-b border-outline-variant/20">
                  <Link href={`/products/${item.slug}`} className="w-24 h-32 shrink-0 bg-[#e9e2d5] rounded-md overflow-hidden block">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  
                  <div className="flex-1">
                    <Link href={`/products/${item.slug}`} className="hover:text-primary transition-colors block mb-1" style={{ fontFamily: playfair, fontSize: "20px", fontWeight: 500 }}>
                      {item.name}
                    </Link>
                    <p className="text-on-surface-variant mb-4" style={{ fontFamily: dmSans, fontSize: "14px" }}>
                      Size: {item.size}
                    </p>
                    <button 
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-on-surface-variant hover:text-red-600 transition-colors uppercase tracking-widest underline underline-offset-4"
                      style={{ fontFamily: dmSans, fontSize: "10px", fontWeight: 600 }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="w-32 flex justify-center">
                    <div className="flex items-center rounded-lg border border-outline-variant overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                        className="px-3 py-1 hover:bg-surface-variant transition-colors text-on-surface"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-on-surface" style={{ fontFamily: dmSans, fontSize: "14px" }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                        className="px-3 py-1 hover:bg-surface-variant transition-colors text-on-surface"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="w-32 text-right" style={{ fontFamily: dmSans, fontSize: "16px", fontWeight: 500 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant">
                <h2 className="mb-6 pb-4 border-b border-outline-variant/30" style={{ fontFamily: playfair, fontSize: "24px", fontWeight: 500 }}>
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-8" style={{ fontFamily: dmSans, fontSize: "16px" }}>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span>{totalPrice > 150 ? "Complimentary" : "Calculated at checkout"}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-8 pt-6 border-t border-outline-variant/30 text-on-surface" style={{ fontFamily: playfair, fontSize: "24px", fontWeight: 500 }}>
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-[#1b1c1c] text-white py-4 rounded-lg uppercase tracking-widest hover:bg-[#343534] transition-colors text-center"
                  style={{ fontFamily: dmSans, fontSize: "14px", fontWeight: 600 }}
                >
                  Checkout
                </Link>
                
                <p className="text-center text-on-surface-variant mt-4" style={{ fontFamily: dmSans, fontSize: "12px" }}>
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

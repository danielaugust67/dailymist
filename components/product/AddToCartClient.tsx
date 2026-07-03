"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Product } from "@/lib/mappers/product.mapper";
import { CartToast } from "@/components/ui/CartToast";

const dmSans = "'DM Sans', sans-serif";

interface Props {
  product: Product;
}

export function AddToCartClient({ product }: Props) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("50ml");
  const [quantity, setQuantity] = useState(1);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!isToastVisible) return;

    const timeout = window.setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [isToastVisible]);

  const redirectToLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent(`/products/${product.slug}`)}`);
  };

  const ensureLoggedIn = async () => {
    setIsCheckingAuth(true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) return true;

      redirectToLogin();
      return false;
    } catch {
      redirectToLogin();
      return false;
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const addSelectedItem = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrls?.[0] || "",
      quantity,
      size: selectedSize,
    });
  };

  const handleAddToCart = async () => {
    const isLoggedIn = await ensureLoggedIn();
    if (!isLoggedIn) return;

    addSelectedItem();
    setIsToastVisible(true);
  };

  const handleBuyNow = async () => {
    const isLoggedIn = await ensureLoggedIn();
    if (!isLoggedIn) return;

    addSelectedItem();
    router.push("/checkout");
  };

  return (
    <>
      <div className="space-y-8 mb-10">
        <div>
          <p
            className="uppercase tracking-widest mb-4 text-on-surface"
            style={{ fontFamily: dmSans, fontSize: "14px", letterSpacing: "0.05em", fontWeight: 500 }}
          >
            Size Selection
          </p>
          <div className="flex flex-wrap gap-3">
            {["30ml", "50ml", "100ml"].map((size) => {
              const isSelected = size === selectedSize;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="rounded-full transition-all active:scale-95"
                  style={{
                    padding: "10px 24px",
                    fontFamily: dmSans,
                    fontSize: "14px",
                    letterSpacing: "0.05em",
                    fontWeight: 500,
                    border: isSelected ? "1px solid #5f5e5b" : "1px solid #c8c7be",
                    background: isSelected ? "#5f5e5b" : "transparent",
                    color: isSelected ? "#ffffff" : "#474741",
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p
            className="uppercase tracking-widest mb-4 text-on-surface"
            style={{ fontFamily: dmSans, fontSize: "14px", letterSpacing: "0.05em", fontWeight: 500 }}
          >
            Quantity
          </p>
          <div className="flex items-center w-fit rounded-lg overflow-hidden" style={{ border: "1px solid #c8c7be" }}>
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-secondary-fixed transition-colors"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="px-6 py-2 border-x border-outline text-on-surface" style={{ fontFamily: dmSans, fontSize: "14px", fontWeight: 500 }}>
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 hover:bg-secondary-fixed transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isCheckingAuth}
          className="text-on-primary rounded-lg uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] shadow-md"
          style={{ background: "#5f5e5b", padding: "16px", fontFamily: dmSans, fontSize: "14px", letterSpacing: "0.05em", fontWeight: 500 }}
        >
          {isCheckingAuth ? "Checking..." : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isCheckingAuth}
          className="text-primary rounded-lg uppercase tracking-widest hover:bg-primary/5 transition-all active:scale-[0.98]"
          style={{ border: "1px solid #5f5e5b", padding: "16px", fontFamily: dmSans, fontSize: "14px", letterSpacing: "0.05em", fontWeight: 500 }}
        >
          Buy Now
        </button>
      </div>

      <CartToast
        isVisible={isToastVisible}
        productName={product.name}
        quantity={quantity}
        onClose={() => setIsToastVisible(false)}
      />
    </>
  );
}

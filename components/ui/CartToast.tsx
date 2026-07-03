"use client";

import Link from "next/link";

const dmSans = "'DM Sans', sans-serif";

interface CartToastProps {
  isVisible: boolean;
  productName: string;
  quantity?: number;
  onClose: () => void;
}

export function CartToast({ isVisible, productName, quantity = 1, onClose }: CartToastProps) {
  return (
    <div
      aria-live="polite"
      className={`fixed right-6 bottom-6 z-[90] w-[min(360px,calc(100vw-32px))] transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="rounded-lg border border-outline-variant bg-white shadow-[0_18px_60px_rgba(27,28,28,0.16)]">
        <div className="flex items-start gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <span className="material-symbols-outlined text-[20px]">check</span>
          </div>
          <div className="min-w-0 flex-1" style={{ fontFamily: dmSans }}>
            <p className="text-sm font-semibold uppercase tracking-widest text-on-surface">
              Added to Cart
            </p>
            <p className="mt-1 truncate text-sm text-on-surface-variant">
              {quantity} x {productName}
            </p>
            <Link
              href="/cart"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-secondary"
            >
              View Cart
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}

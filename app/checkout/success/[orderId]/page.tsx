"use client";

import { useEffect, useState, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Order } from "@/lib/mappers/order.mapper";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

export default function CheckoutSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) setOrder(json.data);
      });
  }, [orderId]);

  if (!order) return <div className="min-h-screen bg-[#fff8f5]"></div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5]">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-24 px-8">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-outline-variant/30 max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          
          <h1 className="mb-4" style={{ fontFamily: playfair, fontSize: "40px" }}>Thank you for your order</h1>
          <p className="text-on-surface-variant mb-8 text-lg" style={{ fontFamily: dmSans }}>
            Your order <strong className="text-on-surface">{order.orderNumber}</strong> has been successfully placed and is now being processed.
          </p>

          <div className="bg-[#fcf9f8] p-6 rounded-xl border border-outline-variant/30 mb-10 text-left">
            <h3 className="uppercase tracking-widest font-semibold text-xs mb-4 text-on-surface-variant" style={{ fontFamily: dmSans }}>Shipping Details</h3>
            <p className="font-semibold text-on-surface mb-1" style={{ fontFamily: dmSans }}>{order.shippingAddress?.recipientName}</p>
            <p className="text-on-surface-variant" style={{ fontFamily: dmSans }}>{order.shippingAddress?.fullAddress}</p>
            <p className="text-on-surface-variant" style={{ fontFamily: dmSans }}>{order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/account/orders/${order.id}`}
              className="bg-[#1b1c1c] text-white px-8 py-4 rounded-lg uppercase tracking-widest text-xs font-semibold hover:opacity-90 transition-opacity"
              style={{ fontFamily: dmSans }}
            >
              View Order Details
            </Link>
            <Link 
              href="/products"
              className="bg-white text-on-surface border border-outline-variant px-8 py-4 rounded-lg uppercase tracking-widest text-xs font-semibold hover:bg-surface-variant transition-colors"
              style={{ fontFamily: dmSans }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/mappers/order.mapper";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

export default function MockPaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const { orderId } = use(params);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) setOrder(json.data);
      });
  }, [orderId]);

  const simulatePayment = async (result: "success" | "failed" | "expired") => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/simulate-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result })
      });

      if (res.ok) {
        if (result === "success") {
          router.push(`/checkout/success/${orderId}`);
        } else {
          router.push(`/account/orders/${orderId}`);
        }
      } else {
        alert("Payment simulation failed API call.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fff8f5]">Loading order details...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f0ec] p-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">credit_card</span>
        </div>
        
        <h1 className="mb-2" style={{ fontFamily: playfair, fontSize: "28px" }}>Mock Payment Gateway</h1>
        <p className="text-on-surface-variant mb-8" style={{ fontFamily: dmSans, fontSize: "14px" }}>
          Order {order.orderNumber}
        </p>

        <div className="bg-[#fcf9f8] p-6 rounded-xl border border-outline-variant/30 mb-8">
          <p className="text-sm text-on-surface-variant mb-1 uppercase tracking-widest" style={{ fontFamily: dmSans }}>Total Amount</p>
          <p className="text-3xl font-medium text-on-surface" style={{ fontFamily: playfair }}>${order.total.toFixed(2)}</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => simulatePayment("success")}
            disabled={isProcessing}
            className="w-full bg-[#1b1c1c] text-white py-4 rounded-lg uppercase tracking-widest font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            style={{ fontFamily: dmSans, fontSize: "12px" }}
          >
            {isProcessing ? "Processing..." : "Simulate Success"}
          </button>
          
          <button 
            onClick={() => simulatePayment("failed")}
            disabled={isProcessing}
            className="w-full bg-white text-red-600 border border-red-200 py-4 rounded-lg uppercase tracking-widest font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
            style={{ fontFamily: dmSans, fontSize: "12px" }}
          >
            Simulate Failed
          </button>
          
          <button 
            onClick={() => simulatePayment("expired")}
            disabled={isProcessing}
            className="w-full bg-white text-on-surface-variant border border-outline-variant/50 py-4 rounded-lg uppercase tracking-widest font-semibold hover:bg-surface-variant transition-colors disabled:opacity-50"
            style={{ fontFamily: dmSans, fontSize: "12px" }}
          >
            Simulate Expired
          </button>
        </div>
      </div>
    </div>
  );
}

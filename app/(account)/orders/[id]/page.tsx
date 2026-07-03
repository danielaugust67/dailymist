"use client";

import { useState, useEffect, use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Order } from "@/lib/mappers/order.mapper";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = () => {
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) setOrder(json.data);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, { method: "PATCH" });
      if (res.ok) {
        fetchOrder();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to cancel order");
      }
    } catch (e) {
      alert("An error occurred");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#fff8f5]"><Navbar /></div>;
  if (!order) return <div className="min-h-screen bg-[#fff8f5]"><Navbar /><p className="text-center py-24">Order not found.</p></div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5]">
      <Navbar />
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full py-16 px-8 md:px-16">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account/orders" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-outline-variant hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 style={{ fontFamily: playfair, fontSize: "40px" }}>Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-outline-variant/30">
                <div>
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1" style={{ fontFamily: dmSans }}>Order Number</p>
                  <p className="text-xl font-medium" style={{ fontFamily: playfair }}>{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {order.items.map(item => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center gap-6">
                    <div className="w-20 h-24 bg-[#e9e2d5] rounded shrink-0 overflow-hidden">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1" style={{ fontFamily: dmSans }}>
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-on-surface-variant">Size: {item.size}</p>
                      <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right font-medium" style={{ fontFamily: dmSans }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.status === 'pending' && (
              <div className="flex justify-end">
                <button 
                  onClick={handleCancel}
                  className="text-red-600 border border-red-200 bg-white px-6 py-3 rounded-lg uppercase tracking-widest text-xs font-semibold hover:bg-red-50 transition-colors"
                  style={{ fontFamily: dmSans }}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm" style={{ fontFamily: dmSans }}>
              <h3 className="uppercase tracking-widest text-xs font-semibold mb-6 border-b border-outline-variant/30 pb-2">Order Summary</h3>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span>${order.shippingFee.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-outline-variant/30 font-medium text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm" style={{ fontFamily: dmSans }}>
              <h3 className="uppercase tracking-widest text-xs font-semibold mb-6 border-b border-outline-variant/30 pb-2">Shipping Information</h3>
              <p className="font-semibold mb-1">{order.shippingAddress?.recipientName}</p>
              <p className="text-on-surface-variant text-sm mb-1">{order.shippingAddress?.fullAddress}</p>
              <p className="text-on-surface-variant text-sm mb-1">{order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}</p>
              <p className="text-on-surface-variant text-sm mt-3 pt-3 border-t border-outline-variant/30">
                Payment: <span className="uppercase">{order.paymentStatus}</span> ({order.paymentMethod})
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

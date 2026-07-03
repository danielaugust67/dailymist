"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getOptimizedImageUrl } from "@/lib/image-url";
import { Order } from "@/lib/mappers/order.mapper";

const playfair = "'Playfair Display', serif";

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [status, setStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = () => {
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setOrder(json.data);
          setStatus(json.data.status);
          setTrackingNumber(json.data.trackingNumber || "");
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber })
      });

      if (res.ok) {
        alert("Order updated successfully");
        fetchOrder();
      } else {
        alert("Failed to update order");
      }
    } catch (e) {
      alert("Error updating order");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="p-2 hover:bg-surface-variant rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-3xl font-bold" style={{ fontFamily: playfair }}>Manage Order: {order.orderNumber}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Order Status Update</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tracking Number</label>
            <input 
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. JNE12345678"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button 
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full bg-primary text-white py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
          <h2 className="font-semibold text-lg border-b pb-2 mb-4">Customer Details</h2>
          <div className="text-sm space-y-2">
            <p><span className="text-on-surface-variant">Name:</span> {order.shippingAddress?.recipientName}</p>
            <p><span className="text-on-surface-variant">Phone:</span> {order.shippingAddress?.phone}</p>
            <p><span className="text-on-surface-variant">Address:</span> {order.shippingAddress?.fullAddress}</p>
            <p><span className="text-on-surface-variant">City:</span> {order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.postalCode}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
        <h2 className="font-semibold text-lg border-b pb-2 mb-4">Items</h2>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
              <div className="flex gap-4 items-center">
                <img
                  src={getOptimizedImageUrl(item.imageUrl, { width: 120 })}
                  alt={item.name}
                  className="w-12 h-16 object-cover bg-surface-variant rounded"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-on-surface-variant">Size: {item.size}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <p className="text-sm text-on-surface-variant mb-1">Subtotal: ${order.subtotal.toFixed(2)}</p>
          <p className="text-sm text-on-surface-variant mb-2">Shipping: ${order.shippingFee.toFixed(2)}</p>
          <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

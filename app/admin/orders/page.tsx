"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Order } from "@/lib/mappers/order.mapper";

const playfair = "'Playfair Display', serif";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(json => {
        setOrders(json.data || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: playfair }}>Manage Orders</h1>
      </div>

      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-variant/30 text-on-surface-variant text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Order Number</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-variant/10 transition-colors">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

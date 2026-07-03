"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getOptimizedImageUrl } from "@/lib/image-url";
import { Order } from "@/lib/mappers/order.mapper";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";
const statusOptions = ["all", "pending", "processing", "shipped", "completed", "cancelled"] as const;

type StatusFilter = (typeof statusOptions)[number];

function getStatusClass(status: Order["status"]) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 border-green-100";
    case "shipped":
      return "bg-purple-50 text-purple-700 border-purple-100";
    case "processing":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "cancelled":
      return "bg-gray-100 text-gray-500 border-gray-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
  }
}

function getOrderTitle(order: Order) {
  if (order.items.length === 0) return "DailyMist Order";

  const firstItem = order.items[0];
  const remainingItems = order.items.length - 1;
  return remainingItems > 0 ? `${firstItem.name} + ${remainingItems} more` : firstItem.name;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [lastSixMonthsOnly, setLastSixMonthsOnly] = useState(false);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((json) => {
        setOrders(json.data || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return orders.filter((order) => {
      const orderTitle = getOrderTitle(order).toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        order.orderNumber.toLowerCase().includes(normalizedSearch) ||
        orderTitle.includes(normalizedSearch);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesDate = !lastSixMonthsOnly || new Date(order.createdAt) >= sixMonthsAgo;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, lastSixMonthsOnly]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full flex gap-0 md:gap-12 px-5 md:px-20 py-12">
        <aside className="hidden md:flex w-64 shrink-0 flex-col gap-4 bg-surface-container-low rounded-lg px-6 py-8 shadow-[10px_0_30px_rgba(74,62,62,0.03)]">
          <div className="mb-8 px-2">
            <h2 className="text-primary" style={{ fontFamily: playfair, fontSize: "24px", lineHeight: "1.4" }}>Your Account</h2>
            <p className="text-on-surface-variant opacity-70" style={{ fontFamily: dmSans, fontSize: "11px", letterSpacing: "0.1em" }}>
              Managing your luxury experience
            </p>
          </div>

          <nav className="space-y-1" style={{ fontFamily: dmSans }}>
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-200 rounded-lg group">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">person</span>
              <span>Profile</span>
            </Link>
            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 text-primary font-bold border-r-2 border-primary bg-surface-variant/30 rounded-lg">
              <span className="material-symbols-outlined text-xl">history</span>
              <span>Order History</span>
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-200 rounded-lg group">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">location_on</span>
              <span>Addresses</span>
            </Link>
            <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-200 rounded-lg group">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">favorite</span>
              <span>Wishlist</span>
            </Link>
            <Link href="/account/settings" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant/50 transition-all duration-200 rounded-lg group">
              <span className="material-symbols-outlined text-xl group-hover:text-primary">settings</span>
              <span>Settings</span>
            </Link>
          </nav>

          <div className="mt-auto px-4 py-4 border-t border-outline-variant/30">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-error hover:opacity-70 transition-opacity uppercase"
              style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="mb-12">
            <h1 className="text-on-surface mb-2" style={{ fontFamily: playfair, fontSize: "32px", lineHeight: "1.3", fontWeight: 400 }}>
              Order History
            </h1>
            <p className="text-on-surface-variant opacity-80 max-w-2xl" style={{ fontFamily: dmSans, fontSize: "16px", lineHeight: "1.6" }}>
              Review your past acquisitions and track current shipments of our signature mists and bespoke fragrance collections.
            </p>
          </header>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="relative w-full lg:w-80">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 px-10 py-3 text-on-surface placeholder:text-on-surface-variant/50 transition-all outline-none"
                style={{ fontFamily: dmSans, fontSize: "16px" }}
                placeholder="Search orders..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLastSixMonthsOnly((value) => !value)}
                className={`px-4 py-2 border rounded-full transition-colors uppercase ${
                  lastSixMonthsOnly
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:bg-surface-variant"
                }`}
                style={{ fontFamily: dmSans, fontSize: "11px", letterSpacing: "0.1em", fontWeight: 500 }}
              >
                Last 6 Months
              </button>

              <label className="relative">
                <span className="sr-only">Filter by status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="appearance-none rounded-full border border-outline-variant/20 bg-surface-container py-2 pl-4 pr-10 text-on-surface-variant uppercase outline-none hover:bg-surface-variant focus:border-primary focus:ring-0"
                  style={{ fontFamily: dmSans, fontSize: "11px", letterSpacing: "0.1em", fontWeight: 500 }}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant">
                  expand_more
                </span>
              </label>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[0, 1, 2].map((item) => (
                <div key={item} className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10 animate-pulse">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-surface-variant rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="w-32 h-3 bg-surface-variant rounded" />
                      <div className="w-64 max-w-full h-5 bg-surface-variant rounded" />
                      <div className="w-40 h-3 bg-surface-variant rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
              <div className="w-16 h-16 rounded-full bg-surface-container mx-auto mb-6 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
              </div>
              <p className="text-on-surface mb-2" style={{ fontFamily: playfair, fontSize: "24px", lineHeight: "1.4" }}>
                No Orders Found
              </p>
              <p className="text-on-surface-variant mb-6" style={{ fontFamily: dmSans }}>
                Your fragrance archive is still quiet.
              </p>
              <Link href="/products" className="inline-flex items-center gap-2 text-primary uppercase tracking-widest font-semibold hover:text-secondary" style={{ fontFamily: dmSans, fontSize: "12px" }}>
                Shop Now
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const firstItem = order.items[0];
                const isCancelled = order.status === "cancelled";

                return (
                  <div
                    key={order.id}
                    className={`bg-surface-container-lowest p-6 rounded-lg transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-outline-variant/10 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(74,62,62,0.08)] hover:border-primary/20 ${
                      isCancelled ? "opacity-70 grayscale" : ""
                    }`}
                  >
                    <div className="flex items-center gap-6 min-w-0">
                      <div className="w-20 h-20 bg-secondary-container rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {firstItem?.imageUrl ? (
                          <img
                            className="w-full h-full object-cover"
                            src={getOptimizedImageUrl(firstItem.imageUrl, { width: 160, height: 160 })}
                            alt={firstItem.name}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-3xl text-outline-variant">inventory_2</span>
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="block text-on-surface-variant/60 uppercase" style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}>
                          Order #{order.orderNumber}
                        </span>
                        <h3 className="text-on-surface truncate" style={{ fontFamily: playfair, fontSize: "18px", lineHeight: "1.4", fontWeight: 400 }}>
                          {getOrderTitle(order)}
                        </h3>
                        <p className="text-on-surface-variant" style={{ fontFamily: dmSans, fontSize: "14px" }}>
                          Ordered on {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-8 lg:gap-12">
                      <div className="text-left lg:text-right">
                        <span className="block mb-1 text-on-surface-variant/60 uppercase" style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}>
                          Status
                        </span>
                        <span className={`inline-flex px-3 py-1 rounded-full border uppercase ${getStatusClass(order.status)}`} style={{ fontFamily: dmSans, fontSize: "10px", letterSpacing: "0.1em", fontWeight: 700 }}>
                          {order.status}
                        </span>
                      </div>

                      <div className="text-left lg:text-right">
                        <span className="block mb-1 text-on-surface-variant/60 uppercase" style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 500 }}>
                          Total
                        </span>
                        <span className="text-primary" style={{ fontFamily: playfair, fontSize: "20px", lineHeight: "1.4" }}>
                          ${order.total.toFixed(2)}
                        </span>
                      </div>

                      <Link
                        href={`/account/orders/${order.id}`}
                        className="flex items-center gap-1 text-primary uppercase group"
                        style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
                      >
                        View Details
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredOrders.length > 0 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-30"
                disabled
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-primary text-on-primary" style={{ fontFamily: dmSans, fontSize: "12px", fontWeight: 600 }}>
                1
              </button>
              <button
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-30"
                disabled
              >
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          )}

          <div className="md:hidden mt-10 rounded-lg bg-surface-container-low p-4">
            <nav className="grid grid-cols-2 gap-2" style={{ fontFamily: dmSans }}>
              {[
                ["Profile", "/account", "person"],
                ["Addresses", "/account/addresses", "location_on"],
                ["Wishlist", "/account/wishlist", "favorite"],
                ["Settings", "/account/settings", "settings"],
              ].map(([label, href, icon]) => (
                <Link key={href} href={href} className="flex items-center gap-2 rounded-lg px-3 py-3 text-on-surface-variant hover:bg-surface-variant/50">
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

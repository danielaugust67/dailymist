import { getLoggedInUser } from "@/lib/appwrite/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getLoggedInUser();
  if (!user || !user.labels?.includes("admin")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#fcf9f8", color: "#1b1c1c", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-outline-variant bg-white flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-outline-variant">
          <Link href="/admin" style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px" }}>
            DailyMist Admin
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span style={{ fontSize: "16px", fontWeight: 500 }}>Dashboard</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span style={{ fontSize: "16px", fontWeight: 500 }}>Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span style={{ fontSize: "16px", fontWeight: 500 }}>Orders</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
            <span style={{ fontSize: "14px" }}>{user.email}</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-primary hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined">storefront</span>
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-outline-variant bg-white flex items-center justify-end px-8">
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary">notifications</button>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

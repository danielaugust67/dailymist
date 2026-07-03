import { getProducts, getCategories } from "@/lib/repositories/product.repository";
import { getAllOrders } from "@/lib/services/order.service";

export default async function AdminDashboardPage() {
  const [productsRes, categories, orders] = await Promise.all([
    getProducts({ includeInactive: true }),
    getCategories(),
    getAllOrders()
  ]);

  const totalRevenue = orders
    .filter(o => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant">
          <h3 className="text-on-surface-variant mb-2 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total Revenue</h3>
          <p className="text-4xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant">
          <h3 className="text-on-surface-variant mb-2 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total Orders</h3>
          <p className="text-4xl font-bold text-primary">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant">
          <h3 className="text-on-surface-variant mb-2 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total Products</h3>
          <p className="text-4xl font-bold text-primary">{productsRes.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant">
          <h3 className="text-on-surface-variant mb-2 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total Categories</h3>
          <p className="text-4xl font-bold text-primary">{categories.length}</p>
        </div>
      </div>
    </div>
  );
}

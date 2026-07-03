"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/mappers/product.mapper";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products?includeInactive=true");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive })
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-on-surface-variant">Loading products...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-sm text-on-surface-variant">
                <th className="p-4 font-medium uppercase tracking-wider">Product</th>
                <th className="p-4 font-medium uppercase tracking-wider">Price</th>
                <th className="p-4 font-medium uppercase tracking-wider">Stock</th>
                <th className="p-4 font-medium uppercase tracking-wider">Status</th>
                <th className="p-4 font-medium uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-variant rounded-md overflow-hidden shrink-0">
                        {product.imageUrls?.[0] ? (
                          <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined flex items-center justify-center h-full text-on-surface-variant">image</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{product.name}</div>
                        <div className="text-sm text-on-surface-variant">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">${product.price}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(product)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-low"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-on-surface-variant hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    No products found. Add your first product!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

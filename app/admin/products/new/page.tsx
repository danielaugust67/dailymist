"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Category } from "@/lib/mappers/product.mapper";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const imageUrls: string[] = [];
      
      // Upload images first
      for (const file of imageFiles) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          imageUrls.push(uploadJson.data.url);
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Create product
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          categoryId: formData.categoryId,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          imageUrls: imageUrls
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to create product");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-surface-variant rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Create Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant space-y-6">
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors bg-transparent"
              placeholder="e.g. Morning Mist"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">Slug</label>
            <input
              required
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors bg-transparent"
              placeholder="e.g. morning-mist"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface">Description</label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors bg-transparent"
            placeholder="A luminous fragrance..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">Price ($)</label>
            <input
              required
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">Stock</label>
            <input
              required
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors bg-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface">Category</label>
          <select
            required
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors bg-transparent"
          >
            <option value="" disabled>Select category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface">Images (Upload)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface-variant file:text-on-surface hover:file:bg-surface-container-high transition-colors cursor-pointer"
          />
          {imageFiles.length > 0 && (
            <p className="text-sm text-on-surface-variant">{imageFiles.length} file(s) selected.</p>
          )}
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
            />
            <span className="text-sm font-medium">Active</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
            />
            <span className="text-sm font-medium">Featured Product</span>
          </label>
        </div>

        <div className="pt-6 border-t border-outline-variant flex justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-2 rounded-lg font-medium hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getImageSrcSet, getOptimizedImageUrl } from "@/lib/image-url";
import { Category, Product } from "@/lib/mappers/product.mapper";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    isActive: true,
    isFeatured: false,
    imageUrls: [] as string[]
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(res => res.json()),
      // We don't have a GET /api/admin/products/[id] yet, but we can fetch by slug or modify.
      // Wait, we need an endpoint to fetch product by ID for admin.
      // Or we can use the list and find it. But wait, we only have GET /api/products/[slug].
      // For now, let's fetch all products and find the one with the matching ID, or just create GET /api/products/[id]
      fetch(`/api/products?includeInactive=true`).then(res => res.json())
    ]).then(([catData, prodData]) => {
      setCategories(catData.data || []);
      const product = prodData.data?.products?.find((p: Product) => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || "",
          price: product.price.toString(),
          stock: product.stock.toString(),
          categoryId: product.categoryId || "",
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          imageUrls: product.imageUrls || []
        });
      } else {
        alert("Product not found");
        router.push("/admin/products");
      }
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setIsFetching(false);
    });
  }, [id, router]);

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

  const handleRemoveImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((imageUrl) => imageUrl !== url),
    }));
  };

  const handleAddImageUrl = () => {
    const normalizedUrl = imageUrlInput.trim();
    if (!normalizedUrl) return;

    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, normalizedUrl],
    }));
    setImageUrlInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const uploadedImageUrls: string[] = [];

      for (const file of imageFiles) {
        const uploadData = new FormData();
        uploadData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          uploadedImageUrls.push(uploadJson.data.url);
        } else {
          const uploadError = await uploadRes.json().catch(() => null);
          throw new Error(uploadError?.message || "Failed to upload image");
        }
      }

      const nextImageUrls = [...formData.imageUrls, ...uploadedImageUrls];

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
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
          imageUrls: nextImageUrls
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update product");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-surface-variant rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Edit Product</h1>
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

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-on-surface">Images</label>
            <p className="text-sm text-on-surface-variant mt-1">
              Upload new images, add an external image URL, or remove existing images.
            </p>
          </div>

          {formData.imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.imageUrls.map((url) => (
                <div key={url} className="relative group rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low">
                  <div className="aspect-[4/5]">
                    <img
                      src={getOptimizedImageUrl(url, { width: 420 })}
                      srcSet={getImageSrcSet(url, [240, 420, 640])}
                      sizes="(min-width: 768px) 33vw, 50vw"
                      alt="Product image"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-outline-variant p-6 text-center text-on-surface-variant">
              No images yet.
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface-variant file:text-on-surface hover:file:bg-surface-container-high transition-colors cursor-pointer"
          />

          {imageFiles.length > 0 && (
            <div className="rounded-lg bg-surface-container-low p-4">
              <p className="text-sm font-medium text-on-surface mb-3">{imageFiles.length} new file(s) selected.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {imageFiles.map((file) => (
                  <div key={`${file.name}-${file.lastModified}`} className="aspect-square rounded-md bg-white border border-outline-variant overflow-hidden flex items-center justify-center text-xs text-on-surface-variant p-2 text-center">
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(event) => setImageUrlInput(event.target.value)}
              placeholder="https://example.com/product-image.jpg"
              className="flex-1 px-4 py-2 border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors bg-transparent"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-5 py-2 rounded-lg border border-outline-variant text-primary hover:bg-surface-container-low transition-colors"
            >
              Add URL
            </button>
          </div>
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
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

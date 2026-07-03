"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Address } from "@/lib/mappers/address.mapper";
import Link from "next/link";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    label: "",
    recipientName: "",
    phone: "",
    fullAddress: "",
    city: "",
    province: "",
    postalCode: "",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const json = await res.json();
        setAddresses(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      label: addr.label,
      recipientName: addr.recipientName,
      phone: addr.phone,
      fullAddress: addr.fullAddress,
      city: addr.city,
      province: addr.province,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true })
      });
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses";
      const method = editingId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({
          label: "", recipientName: "", phone: "", fullAddress: "",
          city: "", province: "", postalCode: "", isDefault: false
        });
        fetchAddresses();
      } else {
        alert("Failed to save address");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5]">
      <Navbar />
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full flex gap-12" style={{ padding: "96px 64px" }}>
        
        {/* Account Sidebar */}
        <aside className="w-64 shrink-0 space-y-4">
          <h2 className="mb-8" style={{ fontFamily: playfair, fontSize: "28px" }}>My Account</h2>
          <nav className="space-y-4" style={{ fontFamily: dmSans, fontSize: "16px" }}>
            <Link href="/account" className="block text-on-surface-variant hover:text-primary transition-colors">Profile</Link>
            <Link href="/account/orders" className="block text-on-surface-variant hover:text-primary transition-colors">Order History</Link>
            <Link href="/account/addresses" className="block text-primary font-medium border-b border-primary w-fit pb-1">Addresses</Link>
            <Link href="/account/wishlist" className="block text-on-surface-variant hover:text-primary transition-colors">Wishlist</Link>
            <Link href="/account/settings" className="block text-on-surface-variant hover:text-primary transition-colors">Settings</Link>
            <button className="block text-on-surface-variant hover:text-red-600 transition-colors mt-8">Log Out</button>
          </nav>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-12">
            <h1 style={{ fontFamily: playfair, fontSize: "40px" }}>Addresses</h1>
            {!showForm && (
              <button 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ label: "", recipientName: "", phone: "", fullAddress: "", city: "", province: "", postalCode: "", isDefault: false });
                  setShowForm(true);
                }}
                className="bg-[#1b1c1c] text-white px-6 py-3 rounded-lg uppercase tracking-widest text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Add New Address
              </button>
            )}
          </div>

          {showForm ? (
            <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm mb-12 animate-fade-up">
              <h3 className="mb-6" style={{ fontFamily: playfair, fontSize: "24px" }}>{editingId ? "Edit Address" : "New Address"}</h3>
              <form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: dmSans, fontSize: "14px" }}>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Label (e.g. Home, Office)</label>
                    <input required type="text" name="label" value={formData.label} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Recipient Name</label>
                    <input required type="text" name="recipientName" value={formData.recipientName} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Phone Number</label>
                  <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Full Address</label>
                  <textarea required name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary" />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Province/State</label>
                    <input required type="text" name="province" value={formData.province} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Postal Code</label>
                    <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="w-4 h-4" />
                  <label htmlFor="isDefault" className="text-sm">Set as default shipping address</label>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-surface-container-low rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="bg-[#1b1c1c] text-white px-8 py-3 rounded-lg uppercase tracking-widest text-xs font-semibold hover:opacity-90 transition-opacity">Save Address</button>
                </div>
              </form>
            </div>
          ) : null}

          {isLoading ? (
            <p>Loading addresses...</p>
          ) : addresses.length === 0 && !showForm ? (
            <div className="text-center py-16 bg-white rounded-xl border border-outline-variant/30">
              <p className="text-on-surface-variant" style={{ fontFamily: dmSans }}>You haven't saved any addresses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm relative">
                  {addr.isDefault && (
                    <span className="absolute top-6 right-6 bg-primary/10 text-primary text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold">
                      Default
                    </span>
                  )}
                  <h3 className="font-bold text-lg mb-2" style={{ fontFamily: playfair }}>{addr.label}</h3>
                  <div className="text-on-surface-variant space-y-1 mb-6" style={{ fontFamily: dmSans, fontSize: "14px" }}>
                    <p className="font-medium text-on-surface">{addr.recipientName}</p>
                    <p>{addr.phone}</p>
                    <p className="mt-2 leading-relaxed">{addr.fullAddress}</p>
                    <p>{addr.city}, {addr.province} {addr.postalCode}</p>
                  </div>
                  <div className="flex gap-4 border-t border-outline-variant/20 pt-4" style={{ fontFamily: dmSans, fontSize: "12px" }}>
                    <button onClick={() => handleEdit(addr)} className="uppercase tracking-widest font-semibold text-on-surface hover:text-primary transition-colors">Edit</button>
                    <button onClick={() => handleDelete(addr.id)} className="uppercase tracking-widest font-semibold text-red-600 hover:opacity-70 transition-colors">Delete</button>
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)} className="uppercase tracking-widest font-semibold ml-auto text-primary hover:opacity-70 transition-colors">Set Default</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

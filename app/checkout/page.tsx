"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Address } from "@/lib/mappers/address.mapper";
import { useCartStore } from "@/store/cart-store";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

type AddressMode = "saved" | "new";

const emptyShippingForm = {
  firstName: "",
  lastName: "",
  phone: "",
  street: "",
  postalCode: "",
  city: "",
  province: "",
  country: "Indonesia",
};

function ProgressStep({ label, active, complete }: { label: string; active?: boolean; complete?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 bg-background px-3 md:px-4">
      <span
        className={`${active ? "text-primary font-bold" : complete ? "text-on-primary-fixed-variant" : "text-on-surface-variant"} uppercase`}
        style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.08em", fontWeight: active ? 700 : 500 }}
      >
        {label}
      </span>
      <div
        className={
          active
            ? "w-3 h-3 rounded-full bg-primary border-4 border-secondary-container"
            : complete
              ? "w-2 h-2 rounded-full bg-primary"
              : "w-2 h-2 rounded-full bg-outline-variant"
        }
      />
    </div>
  );
}

function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block mb-2 text-on-surface-variant uppercase" style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.08em", fontWeight: 500 }}>
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="w-full h-14 px-4 bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 transition-all duration-300 outline-none text-on-surface"
        style={{ fontFamily: dmSans, fontSize: "16px" }}
      />
    </label>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressMode, setAddressMode] = useState<AddressMode>("saved");
  const [paymentMethod, setPaymentMethod] = useState("mock_credit_card");
  const [shippingForm, setShippingForm] = useState(emptyShippingForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);

  const shippingFee = subtotal > 150 ? 0 : 15;
  const total = subtotal + shippingFee;

  useEffect(() => {
    setMounted(true);
    fetch("/api/addresses")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const savedAddresses: Address[] = json?.data || [];
        setAddresses(savedAddresses);
        const defaultAddress = savedAddresses.find((address) => address.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (savedAddresses.length > 0) {
          setSelectedAddressId(savedAddresses[0].id);
        } else {
          setAddressMode("new");
        }
      })
      .catch(() => {
        setAddressMode("new");
      });
  }, []);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const newShippingAddress = useMemo(() => {
    const recipientName = `${shippingForm.firstName} ${shippingForm.lastName}`.trim();
    return {
      label: "Checkout",
      recipientName,
      phone: shippingForm.phone,
      fullAddress: shippingForm.street,
      city: shippingForm.city,
      province: shippingForm.province || shippingForm.country,
      postalCode: shippingForm.postalCode,
      isDefault: false,
    };
  }, [shippingForm]);

  const hasValidNewAddress =
    shippingForm.firstName &&
    shippingForm.lastName &&
    shippingForm.phone &&
    shippingForm.street &&
    shippingForm.postalCode &&
    shippingForm.city;

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface">
        <header className="bg-surface-container-low w-full px-5 md:px-16 py-10">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between">
            <button onClick={() => router.push("/products")} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <h1 className="text-primary" style={{ fontFamily: playfair, fontSize: "24px", lineHeight: "1.3" }}>Checkout</h1>
            <div className="w-10" />
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-primary mb-8">
            <span className="material-symbols-outlined text-4xl">shopping_bag</span>
          </div>
          <h2 className="text-primary mb-3" style={{ fontFamily: playfair, fontSize: "32px", lineHeight: "1.2" }}>
            Your Cart Is Empty
          </h2>
          <p className="text-on-surface-variant mb-8 max-w-md" style={{ fontFamily: dmSans }}>
            Select a signature mist before beginning checkout.
          </p>
          <Link href="/products" className="bg-primary text-white px-8 py-4 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity" style={{ fontFamily: dmSans, fontSize: "12px", fontWeight: 700 }}>
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShippingChange = (key: keyof typeof shippingForm, value: string) => {
    setShippingForm((current) => ({ ...current, [key]: value }));
  };

  const handlePlaceOrder = async () => {
    setErrorMessage("");

    const shippingAddress = addressMode === "saved" ? selectedAddress : newShippingAddress;

    if (!shippingAddress || (addressMode === "new" && !hasValidNewAddress)) {
      setErrorMessage("Please complete your shipping address before continuing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items,
          shippingAddress,
          paymentMethod,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        clearCart();
        router.push(`/checkout/payment/${json.data.id}`);
        return;
      }

      setErrorMessage(json.message || json.error?.message || "Failed to place order.");
    } catch {
      setErrorMessage("An error occurred while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <header className="bg-surface-container-low flex flex-col items-center w-full pt-10 pb-6 px-5 md:px-16">
        <div className="flex justify-between items-center w-full max-w-[1280px]">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-all duration-200 active:scale-95"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="text-primary" style={{ fontFamily: playfair, fontSize: "24px", lineHeight: "1.3" }}>Checkout</h1>
          <div className="w-10" />
        </div>

        <nav className="mt-8 w-full max-w-2xl overflow-x-auto">
          <div className="flex justify-between items-center relative min-w-[520px]">
            <div className="absolute top-1/2 left-0 w-full h-px bg-secondary-container -z-0" />
            <ProgressStep label="Cart" complete />
            <ProgressStep label="Shipping" active />
            <ProgressStep label="Payment" />
            <ProgressStep label="Confirmation" />
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-5 md:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-primary" style={{ fontFamily: playfair, fontSize: "24px", lineHeight: "1.3" }}>Saved Addresses</h2>
                <Link href="/account/addresses" className="text-secondary hover:text-primary uppercase" style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Manage
                </Link>
              </div>

              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => {
                    const isSelected = addressMode === "saved" && selectedAddressId === address.id;

                    return (
                      <label key={address.id} className="relative block cursor-pointer group">
                        <input
                          checked={isSelected}
                          onChange={() => {
                            setAddressMode("saved");
                            setSelectedAddressId(address.id);
                          }}
                          className="sr-only"
                          name="saved_address"
                          type="radio"
                        />
                        <div className={`p-6 rounded-xl border bg-surface-container-lowest transition-all duration-300 shadow-[0_4px_20px_rgba(51,51,51,0.05)] ${
                          isSelected ? "border-primary ring-1 ring-primary" : "border-outline-variant hover:border-primary"
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="uppercase text-primary" style={{ fontFamily: dmSans, fontSize: "14px", letterSpacing: "0.05em", fontWeight: 600 }}>
                              {address.label || "Saved"}
                            </span>
                            <span className={`material-symbols-outlined ${isSelected ? "text-primary" : "text-outline-variant"}`} style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>
                              {isSelected ? "check_circle" : "circle"}
                            </span>
                          </div>
                          <p className="text-secondary" style={{ fontFamily: dmSans, fontSize: "16px", lineHeight: "1.6" }}>{address.recipientName}</p>
                          <p className="text-secondary" style={{ fontFamily: dmSans, fontSize: "16px", lineHeight: "1.6" }}>{address.fullAddress}</p>
                          <p className="text-secondary" style={{ fontFamily: dmSans, fontSize: "16px", lineHeight: "1.6" }}>
                            {address.city}, {address.province} {address.postalCode}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-secondary" style={{ fontFamily: dmSans }}>
                  No saved addresses yet. Use the new shipping address form below.
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-primary" style={{ fontFamily: playfair, fontSize: "24px", lineHeight: "1.3" }}>New Shipping Address</h2>
                <button
                  type="button"
                  onClick={() => setAddressMode("new")}
                  className={`rounded-full px-4 py-2 border uppercase ${addressMode === "new" ? "border-primary bg-primary text-white" : "border-outline-variant text-secondary hover:border-primary"}`}
                  style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.08em", fontWeight: 600 }}
                >
                  Use New
                </button>
              </div>

              <div className={`space-y-6 ${addressMode !== "new" ? "opacity-60" : ""}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingInput label="First Name" value={shippingForm.firstName} onChange={(value) => handleShippingChange("firstName", value)} />
                  <FloatingInput label="Last Name" value={shippingForm.lastName} onChange={(value) => handleShippingChange("lastName", value)} />
                </div>
                <FloatingInput label="Phone Number" value={shippingForm.phone} onChange={(value) => handleShippingChange("phone", value)} />
                <FloatingInput label="Street Address" value={shippingForm.street} onChange={(value) => handleShippingChange("street", value)} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FloatingInput label="Postal Code" value={shippingForm.postalCode} onChange={(value) => handleShippingChange("postalCode", value)} />
                  <FloatingInput label="City" value={shippingForm.city} onChange={(value) => handleShippingChange("city", value)} />
                  <FloatingInput label="Province" value={shippingForm.province} onChange={(value) => handleShippingChange("province", value)} />
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-container-low p-8 rounded-xl shadow-[0_4px_20px_rgba(51,51,51,0.05)]">
                <h2 className="text-primary mb-6" style={{ fontFamily: playfair, fontSize: "24px", lineHeight: "1.3" }}>Order Summary</h2>
                <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-surface-container-high rounded overflow-hidden flex-shrink-0">
                        {item.imageUrl ? <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.name} /> : null}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-primary uppercase truncate" style={{ fontFamily: dmSans, fontSize: "14px", letterSpacing: "0.05em", fontWeight: 600 }}>{item.name}</p>
                        <p className="text-secondary" style={{ fontFamily: dmSans, fontSize: "12px", letterSpacing: "0.08em" }}>{item.size} x Qty: {item.quantity}</p>
                      </div>
                      <span className="text-primary font-bold" style={{ fontFamily: dmSans }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-outline-variant" style={{ fontFamily: dmSans }}>
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Shipping</span>
                    <span className="uppercase tracking-widest text-xs">{shippingFee === 0 ? "Complimentary" : `$${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-primary font-bold pt-4" style={{ fontFamily: playfair, fontSize: "24px" }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="uppercase tracking-wider text-secondary" style={{ fontFamily: dmSans, fontSize: "14px", fontWeight: 600 }}>Payment Method</h3>
                <div className="space-y-3">
                  {[
                    ["mock_credit_card", "credit_card", "Credit Card"],
                    ["paypal_mock", "payments", "PayPal"],
                  ].map(([value, icon, label]) => {
                    const isSelected = paymentMethod === value;

                    return (
                      <label key={value} className={`relative flex items-center p-4 bg-surface-container-lowest border rounded-xl cursor-pointer hover:border-primary transition-all duration-300 ${isSelected ? "border-primary" : "border-outline-variant"}`}>
                        <input checked={isSelected} onChange={() => setPaymentMethod(value)} className="sr-only" name="payment" type="radio" />
                        <span className={`material-symbols-outlined mr-3 ${isSelected ? "text-primary" : "text-secondary"}`}>{icon}</span>
                        <span className="text-primary" style={{ fontFamily: dmSans, fontSize: "14px", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</span>
                        <div className={`absolute right-4 w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-primary bg-primary" : "border-outline-variant"}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-error-container bg-error-container/50 px-4 py-3 text-error" style={{ fontFamily: dmSans, fontSize: "14px" }}>
                  {errorMessage}
                </div>
              )}

              <div className="space-y-6 pt-6">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-primary text-background h-16 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
                  style={{ fontFamily: dmSans, fontSize: "14px", fontWeight: 700 }}
                >
                  {isSubmitting ? "Processing..." : "Complete Purchase"}
                </button>
                <Link href="/cart" className="block text-center text-secondary hover:text-primary uppercase tracking-wider transition-colors" style={{ fontFamily: dmSans, fontSize: "14px", fontWeight: 600 }}>
                  Return to Cart
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

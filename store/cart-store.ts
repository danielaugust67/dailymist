import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
}

interface CartState {
  items: CartItem[];
  // Computed
  totalItems: () => number;
  totalPrice: () => number;
  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.size === newItem.size
          );

          if (existingIndex >= 0) {
            // Increase quantity if same product+size already in cart
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity:
                updatedItems[existingIndex].quantity + (newItem.quantity ?? 1),
            };
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              { ...newItem, quantity: newItem.quantity ?? 1 },
            ],
          };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.size === size)
          ),
        }));
      },

      updateQuantity: (productId, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "dailymist-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

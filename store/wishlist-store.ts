import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        if (state.items.some(i => i.productId === item.productId)) return state;
        return { items: [...state.items, item] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId)
      })),
      hasItem: (productId) => get().items.some(item => item.productId === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "dailymist-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

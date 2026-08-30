import { create } from "zustand";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: CartItem, restaurantId: string) => void;
  removeItem: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clear: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,

  addItem: (item, restaurantId) => {
    const currentRestaurant = get().restaurantId;
    if (currentRestaurant && currentRestaurant !== restaurantId) {
      // เปลี่ยนร้าน → เคลียร์รถเข็นเดิม
      set({ items: [item], restaurantId });
    } else {
      set((state) => ({
        items: [...state.items, item],
        restaurantId: state.restaurantId || restaurantId,
      }));
    }
  },

  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),

  updateQty: (index, qty) =>
    set((state) => ({
      items: state.items.map((item, i) =>
        i === index ? { ...item, qty: Math.max(1, qty) } : item
      ),
    })),

  clear: () => set({ items: [], restaurantId: null }),

  getSubtotal: () =>
    get().items.reduce((sum, item) => {
      const optionsTotal = item.options.reduce((s, o) => s + o.priceAdd, 0);
      return sum + (item.price + optionsTotal) * item.qty;
    }, 0),

  getTotalItems: () => get().items.reduce((sum, item) => sum + item.qty, 0),
}));

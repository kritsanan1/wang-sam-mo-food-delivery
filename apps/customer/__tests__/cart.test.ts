import { useCartStore } from "@/store/cart";
import { CartItem } from "@/types";

describe("Cart Store", () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  const mockItem: CartItem = {
    itemId: "item_001",
    name: "ก๋วยเตี๋ยวเนื้อ",
    price: 50,
    qty: 1,
    options: [{ name: "ขนาด", choice: "พิเศษ", priceAdd: 10 }],
    notes: "ไม่ใส่ผัก",
  };

  const mockItem2: CartItem = {
    itemId: "item_002",
    name: "ก๋วยเตี๋ยวหมู",
    price: 45,
    qty: 2,
    options: [],
  };

  describe("addItem", () => {
    it("should add item to empty cart", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockItem, "rest_001");

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].name).toBe("ก๋วยเตี๋ยวเนื้อ");
      expect(state.restaurantId).toBe("rest_001");
    });

    it("should add multiple items from same restaurant", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockItem, "rest_001");
      addItem(mockItem2, "rest_001");

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
    });

    it("should clear cart when switching restaurants", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockItem, "rest_001");
      addItem(mockItem2, "rest_002"); // different restaurant

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].itemId).toBe("item_002");
      expect(state.restaurantId).toBe("rest_002");
    });
  });

  describe("removeItem", () => {
    it("should remove item at index", () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockItem, "rest_001");
      addItem(mockItem2, "rest_001");

      removeItem(0);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].itemId).toBe("item_002");
    });
  });

  describe("updateQty", () => {
    it("should update quantity at index", () => {
      const { addItem, updateQty } = useCartStore.getState();
      addItem(mockItem, "rest_001");

      updateQty(0, 3);

      const state = useCartStore.getState();
      expect(state.items[0].qty).toBe(3);
    });

    it("should not allow quantity below 1", () => {
      const { addItem, updateQty } = useCartStore.getState();
      addItem(mockItem, "rest_001");

      updateQty(0, 0);

      const state = useCartStore.getState();
      expect(state.items[0].qty).toBe(1);
    });

    it("should not allow negative quantity", () => {
      const { addItem, updateQty } = useCartStore.getState();
      addItem(mockItem, "rest_001");

      updateQty(0, -5);

      const state = useCartStore.getState();
      expect(state.items[0].qty).toBe(1);
    });
  });

  describe("getSubtotal", () => {
    it("should calculate subtotal with options", () => {
      const { addItem, getSubtotal } = useCartStore.getState();
      addItem(mockItem, "rest_001"); // 50 + 10 = 60, qty 1 = 60

      expect(getSubtotal()).toBe(60);
    });

    it("should calculate subtotal with multiple items", () => {
      const { addItem, getSubtotal } = useCartStore.getState();
      addItem(mockItem, "rest_001");  // (50+10)*1 = 60
      addItem(mockItem2, "rest_001"); // 45*2 = 90

      expect(getSubtotal()).toBe(150);
    });

    it("should return 0 for empty cart", () => {
      const { getSubtotal } = useCartStore.getState();
      expect(getSubtotal()).toBe(0);
    });
  });

  describe("getTotalItems", () => {
    it("should count total items including quantity", () => {
      const { addItem, getTotalItems } = useCartStore.getState();
      addItem(mockItem, "rest_001");  // qty 1
      addItem(mockItem2, "rest_001"); // qty 2

      expect(getTotalItems()).toBe(3);
    });

    it("should return 0 for empty cart", () => {
      const { getTotalItems } = useCartStore.getState();
      expect(getTotalItems()).toBe(0);
    });
  });

  describe("clear", () => {
    it("should clear all items and restaurant", () => {
      const { addItem, clear } = useCartStore.getState();
      addItem(mockItem, "rest_001");

      clear();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.restaurantId).toBeNull();
    });
  });
});

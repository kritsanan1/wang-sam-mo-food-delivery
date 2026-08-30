import { ORDER_STATUS_LABELS, type MenuItem } from "@/types";

describe("Restaurant Types", () => {
  describe("ORDER_STATUS_LABELS", () => {
    it("should have Thai labels for restaurant-relevant statuses", () => {
      const restaurantStatuses = ["pending", "accepted", "preparing", "ready", "rejected"];
      for (const status of restaurantStatuses) {
        expect(ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]).toBeDefined();
      }
    });

    it("should have correct label for pending status", () => {
      expect(ORDER_STATUS_LABELS.pending).toBe("รอรับคำสั่ง");
    });

    it("should have correct label for accepted status", () => {
      expect(ORDER_STATUS_LABELS.accepted).toBe("รับแล้ว");
    });
  });

  describe("MenuItem interface", () => {
    it("should create a valid menu item", () => {
      const item: MenuItem = {
        id: "item_001",
        name: "ก๋วยเตี๋ยวเนื้อ",
        description: "เนื้อสดนุ่ม ซดน้ำซุบ",
        price: 50,
        imageUrl: "",
        category: "ก๋วยเตี๋ยว",
        isAvailable: true,
      };

      expect(item.name).toBe("ก๋วยเตี๋ยวเนื้อ");
      expect(item.price).toBe(50);
      expect(item.isAvailable).toBe(true);
    });

    it("should handle unavailable items", () => {
      const item: MenuItem = {
        id: "item_004",
        name: "เกี้ยวหมู",
        description: "เกี้ยวทำมือ",
        price: 55,
        imageUrl: "",
        category: "ก๋วยเตี๋ยว",
        isAvailable: false,
      };

      expect(item.isAvailable).toBe(false);
    });
  });
});

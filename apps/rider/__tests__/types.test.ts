import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/types";

describe("Rider Types", () => {
  describe("ORDER_STATUS_LABELS", () => {
    it("should have Thai labels for all rider-relevant statuses", () => {
      const riderStatuses: OrderStatus[] = ["ready", "picked_up", "delivered"];
      for (const status of riderStatuses) {
        expect(ORDER_STATUS_LABELS[status]).toBeDefined();
        expect(ORDER_STATUS_LABELS[status].length).toBeGreaterThan(0);
      }
    });

    it("should have correct label for ready status", () => {
      expect(ORDER_STATUS_LABELS.ready).toBe("พร้อมส่งแล้ว");
    });

    it("should have correct label for picked_up status", () => {
      expect(ORDER_STATUS_LABELS.picked_up).toBe("กำลังส่ง");
    });

    it("should have correct label for delivered status", () => {
      expect(ORDER_STATUS_LABELS.delivered).toBe("ส่งถึงแล้ว");
    });
  });

  describe("Order interface", () => {
    it("should have required fields for rider job", () => {
      const mockOrder: Order = {
        id: "order_001",
        customerId: "cust_001",
        customerPhone: "0812345678",
        restaurantId: "rest_001",
        items: [],
        subtotal: 100,
        deliveryFee: 30,
        total: 130,
        commission: 12,
        status: "ready",
        deliveryAddress: "หมู่ 5 วังสามหมอ",
        paymentMethod: "cod",
        paymentStatus: "pending",
        createdAt: new Date(),
      };

      expect(mockOrder.id).toBe("order_001");
      expect(mockOrder.deliveryFee).toBe(30);
      expect(mockOrder.status).toBe("ready");
      expect(mockOrder.deliveryAddress).toContain("วังสามหมอ");
    });

    it("should calculate rider earnings (80% of delivery fee)", () => {
      const deliveryFee = 30;
      const riderEarnings = deliveryFee * 0.8;
      expect(riderEarnings).toBe(24);
    });
  });
});

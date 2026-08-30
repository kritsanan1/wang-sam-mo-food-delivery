import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS, type OrderStatus } from "@/types";

describe("Order Status Types", () => {
  describe("ORDER_STATUS_LABELS", () => {
    it("should have Thai label for each status", () => {
      const statuses: OrderStatus[] = [
        "pending", "accepted", "preparing", "ready",
        "picked_up", "delivered", "cancelled", "rejected",
      ];

      for (const status of statuses) {
        expect(ORDER_STATUS_LABELS[status]).toBeDefined();
        expect(typeof ORDER_STATUS_LABELS[status]).toBe("string");
        // Should be Thai characters or known text
        expect(ORDER_STATUS_LABELS[status].length).toBeGreaterThan(0);
      }
    });

    it("should have correct labels for key statuses", () => {
      expect(ORDER_STATUS_LABELS.pending).toBe("รอร้านรับคำสั่ง");
      expect(ORDER_STATUS_LABELS.accepted).toBe("ร้านรับคำสั่งแล้ว");
      expect(ORDER_STATUS_LABELS.delivered).toBe("ส่งถึงแล้ว");
      expect(ORDER_STATUS_LABELS.cancelled).toBe("ยกเลิก");
      expect(ORDER_STATUS_LABELS.rejected).toBe("ร้านปฏิเสธ");
    });
  });

  describe("ORDER_STATUS_STEPS", () => {
    it("should have 6 steps in correct order", () => {
      expect(ORDER_STATUS_STEPS).toHaveLength(6);
      expect(ORDER_STATUS_STEPS[0]).toBe("pending");
      expect(ORDER_STATUS_STEPS[1]).toBe("accepted");
      expect(ORDER_STATUS_STEPS[2]).toBe("preparing");
      expect(ORDER_STATUS_STEPS[3]).toBe("ready");
      expect(ORDER_STATUS_STEPS[4]).toBe("picked_up");
      expect(ORDER_STATUS_STEPS[5]).toBe("delivered");
    });

    it("should not include cancelled or rejected in steps", () => {
      expect(ORDER_STATUS_STEPS).not.toContain("cancelled");
      expect(ORDER_STATUS_STEPS).not.toContain("rejected");
    });
  });
});

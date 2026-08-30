export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
}

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  qty: number;
  options: { name: string; choice: string; priceAdd: number }[];
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerPhone: string;
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: "promptpay" | "cod";
  createdAt: any;
}

export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled" | "rejected";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "รอรับคำสั่ง",
  accepted: "รับแล้ว",
  preparing: "กำลังทำ",
  ready: "พร้อมส่ง",
  picked_up: "กำลังส่ง",
  delivered: "ส่งแล้ว",
  cancelled: "ยกเลิก",
  rejected: "ปฏิเสธ",
};

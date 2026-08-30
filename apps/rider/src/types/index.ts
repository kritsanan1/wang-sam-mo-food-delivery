// Shared types — same as customer app
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  options?: MenuOption[];
}

export interface MenuOption {
  name: string;
  choices: OptionChoice[];
}

export interface OptionChoice {
  label: string;
  priceAdd: number;
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
  customerName?: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName?: string;
  riderId?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  commission: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: "promptpay" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: any;
}

export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled" | "rejected";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "รอร้านรับคำสั่ง",
  accepted: "ร้านรับคำสั่งแล้ว",
  preparing: "กำลังทำอาหาร",
  ready: "พร้อมส่งแล้ว",
  picked_up: "กำลังส่ง",
  delivered: "ส่งถึงแล้ว",
  cancelled: "ยกเลิก",
  rejected: "ร้านปฏิเสธ",
};

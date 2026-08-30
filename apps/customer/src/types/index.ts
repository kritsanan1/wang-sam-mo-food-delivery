// ประเภทข้อมูลทั้งหมดสำหรับ Customer App

export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  address: string;
  geo: { lat: number; lng: number };
  imageUrl: string;
  rating: number;
  totalOrders: number;
  isOpen: boolean;
  deliveryFee: number;
  minOrder: number;
  categories: string[];
  openingHours: Record<string, { open: string; close: string }>;
  commissionRate: number;
  ownerUserId: string;
  distance?: number; // computed on client
}

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
  name: string; // e.g. "ขนาด", "ระดับเผ็ด"
  choices: OptionChoice[];
}

export interface OptionChoice {
  label: string; // e.g. "พิเศษ", "เผ็ดน้อย"
  priceAdd: number;
}

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  qty: number;
  options: { name: string; choice: string; priceAdd: number }[];
  notes?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  riderId?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  commission: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryGeo?: { lat: number; lng: number };
  customerPhone: string;
  paymentMethod: "promptpay" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  rating?: number;
  review?: string;
}

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "picked_up"
  | "delivered"
  | "cancelled"
  | "rejected";

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

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "picked_up",
  "delivered",
];

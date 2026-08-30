/**
 * Firestore Seed Data Script
 * 
 * รัน: npx tsx scripts/seed-firestore.ts
 * หรือ: npx ts-node scripts/seed-firestore.ts
 * 
 * ต้องตั้งค่า GOOGLE_APPLICATION_CREDENTIALS หรือใช้ firebase admin sdk
 */

import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

const app = initializeApp({
  projectId: "wang-sam-mo-food-delivery",
});

const db = getFirestore(app);
const batch = db.batch();

// ============================================================
// RESTAURANTS — 5 ร้านตัวอย่างในวังสามหมอ
// ============================================================

const restaurants = [
  {
    id: "rest_kuayteaw_pa_som",
    name: "ร้านก๋วยเตี๋ยวป้าสม",
    phone: "0812345678",
    address: "หมู่ 7 ต.วังสามหมอ อ.วังสามหมอ จ.อุดรธานี",
    geo: { lat: 17.0517, lng: 103.0985 },
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8277d2d2d5?w=800",
    rating: 4.5,
    totalOrders: 0,
    isOpen: true,
    deliveryFee: 20,
    minOrder: 50,
    categories: ["ไทย", "ก๋วยเตี๋ยว"],
    openingHours: { mon: { open: "08:00", close: "17:00" }, tue: { open: "08:00", close: "17:00" } },
    commissionRate: 0.12,
    ownerUserId: "user_pa_som",
    status: "active",
  },
  {
    id: "rest_khaomuem_yen",
    name: "ร้านข้าวมื้อเย็น",
    phone: "0823456789",
    address: "หมู่ 5 ต.วังสามหมอ อ.วังสามหมอ จ.อุดรธานี",
    geo: { lat: 17.0489, lng: 103.0956 },
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    rating: 4.2,
    totalOrders: 0,
    isOpen: true,
    deliveryFee: 25,
    minOrder: 60,
    categories: ["ไทย", "ข้าวต้ม"],
    openingHours: { mon: { open: "10:00", close: "20:00" } },
    commissionRate: 0.12,
    ownerUserId: "user_khaomuem",
    status: "active",
  },
  {
    id: "rest_gaiyang_nong",
    name: "ร้านไก่ย่างน้อง",
    phone: "0834567890",
    address: "ตลาดวังสามหมอ อ.วังสามหมอ จ.อุดรธานี",
    geo: { lat: 17.0523, lng: 103.1001 },
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b7ea94e484f?w=800",
    rating: 4.7,
    totalOrders: 0,
    isOpen: true,
    deliveryFee: 20,
    minOrder: 80,
    categories: ["ไทย", "อีสาน", "ปิ้งย่าง"],
    openingHours: { mon: { open: "09:00", close: "21:00" } },
    commissionRate: 0.12,
    ownerUserId: "user_gaiyang",
    status: "active",
  },
  {
    id: "rest_somtum_pui",
    name: "ร้านส้มตำปุ้ย",
    phone: "0845678901",
    address: "หน้า รพ.สต.วังสามหมอ อ.วังสามหมอ จ.อุดรธานี",
    geo: { lat: 17.0501, lng: 103.0978 },
    imageUrl: "https://images.unsplash.com/photo-1559054663-e8c232e19d7c?w=800",
    rating: 4.3,
    totalOrders: 0,
    isOpen: false,
    deliveryFee: 25,
    minOrder: 40,
    categories: ["อีสาน", "ส้มตำ"],
    openingHours: { mon: { open: "10:00", close: "18:00" } },
    commissionRate: 0.12,
    ownerUserId: "user_somtum",
    status: "active",
  },
  {
    id: "rest_coffee_wang",
    name: "ร้านกาแฟวังสามหมอ",
    phone: "0856789012",
    address: "แยกวังสามหมอ อ.วังสามหมอ จ.อุดรธานี",
    geo: { lat: 17.0510, lng: 103.0990 },
    imageUrl: "https://images.unsplash.com/photo-1554118811-83e896c1550c?w=800",
    rating: 4.8,
    totalOrders: 0,
    isOpen: true,
    deliveryFee: 15,
    minOrder: 50,
    categories: ["เครื่องดื่ม", "กาแฟ", "ขนม"],
    openingHours: { mon: { open: "07:00", close: "19:00" } },
    commissionRate: 0.10,
    ownerUserId: "user_coffee",
    status: "active",
  },
];

// ============================================================
// MENU ITEMS — เมนูสำหรับแต่ละร้าน
// ============================================================

const menus: Record<string, any[]> = {
  rest_kuayteaw_pa_som: [
    { name: "ก๋วยเตี๋ยวเนื้อ", description: "เนื้อสดนุ่ม ซดน้ำซุบ", price: 50, category: "ก๋วยเตี๋ยว", isAvailable: true, imageUrl: "", options: [
      { name: "ขนาด", choices: [{ label: "ธรรมดา", priceAdd: 0 }, { label: "พิเศษ", priceAdd: 10 }] },
      { name: "ระดับเผ็ด", choices: [{ label: "ไม่เผ็ด", priceAdd: 0 }, { label: "เผ็ดน้อย", priceAdd: 0 }, { label: "เผ็ดกลาง", priceAdd: 0 }, { label: "เผ็ดมาก", priceAdd: 0 }] },
    ]},
    { name: "ก๋วยเตี๋ยวหมู", description: "หมูนุ่ม ซดน้ำซุบ", price: 45, category: "ก๋วยเตี๋ยว", isAvailable: true, imageUrl: "", options: [
      { name: "ขนาด", choices: [{ label: "ธรรมดา", priceAdd: 0 }, { label: "พิเศษ", priceAdd: 10 }] },
    ]},
    { name: "ก๋วยเตี๋ยวตับ", description: "ตับสด ไม่มีกลิ่น", price: 45, category: "ก๋วยเตี๋ยว", isAvailable: true, imageUrl: "" },
    { name: "เกี้ยวหมู", description: "เกี้ยวทำมือ ไส้หมู", price: 55, category: "ก๋วยเตี๋ยว", isAvailable: false, imageUrl: "" },
  ],
  rest_khaomuem_yen: [
    { name: "ข้าวต้มหมู", description: "ข้าวต้มร้อนๆ หมูนุ่ม", price: 40, category: "ข้าวต้ม", isAvailable: true, imageUrl: "" },
    { name: "ข้าวหมูแดง", description: "หมูแดงย่าง ข้าวร้อน", price: 55, category: "ข้าว", isAvailable: true, imageUrl: "" },
    { name: "ข้าวไก่ทอด", description: "ไก่ทอดกรอบ ข้าวเหนียว", price: 50, category: "ข้าว", isAvailable: true, imageUrl: "" },
  ],
  rest_gaiyang_nong: [
    { name: "ไก่ย่าง", description: "ไก่ย่างถ่าน หอมเครื่องเทศ", price: 120, category: "ปิ้งย่าง", isAvailable: true, imageUrl: "", options: [
      { name: "ขนาด", choices: [{ label: "ครึ่งตัว", priceAdd: 0 }, { label: "1 ตัว", priceAdd: 80 }] },
    ]},
    { name: "ส้มตำไก่ย่าง", description: "ส้มตำรสเด็ด ไก่ย่างนุ่ม", price: 60, category: "ส้มตำ", isAvailable: true, imageUrl: "" },
    { name: "ลาบหมู", description: "ลาบหมูอีสาน รสจัดจ้าน", price: 70, category: "อีสาน", isAvailable: true, imageUrl: "" },
    { name: "น้ำตกหมู", description: "น้ำตกหมูสด เผ็ดร้อน", price: 70, category: "อีสาน", isAvailable: true, imageUrl: "" },
  ],
  rest_somtum_pui: [
    { name: "ส้มตำไทย", description: "ส้มตำปูปลาร้า", price: 45, category: "ส้มตำ", isAvailable: true, imageUrl: "" },
    { name: "ส้มตำปู", description: "ปูสด ตำใหม่", price: 60, category: "ส้มตำ", isAvailable: true, imageUrl: "" },
    { name: "ไก่ทอด", description: "ไก่ทอดกรอบนอกนุ่มใน", price: 80, category: "ทอด", isAvailable: true, imageUrl: "" },
  ],
  rest_coffee_wang: [
    { name: "เอสเปรสso", description: "กาแฟเข้มข้น คั่วสด", price: 45, category: "กาแฟ", isAvailable: true, imageUrl: "" },
    { name: "ลาเต้ร้อน", description: "นมสด กาแฟหอม", price: 55, category: "กาแฟ", isAvailable: true, imageUrl: "" },
    { name: "ชาเย็น", description: "ชาไทยเย็น หวานมัน", price: 35, category: "ชา", isAvailable: true, imageUrl: "" },
    { name: "โรตีสด", description: "โรตีทอดกรอบ ทาเนย", price: 30, category: "ขนม", isAvailable: true, imageUrl: "" },
  ],
};

// ============================================================
// RIDER — 3 riders ตัวอย่าง
// ============================================================

const riders = [
  {
    id: "rider_somchai",
    name: "สมชาย ใจดี",
    phone: "0891234567",
    vehicleType: "มอเตอร์ไซค์",
    isOnline: false,
    currentOrderId: null,
    geo: { lat: 17.0510, lng: 103.0980 },
    totalEarnings: 0,
    totalDeliveries: 0,
    rating: 4.8,
    status: "active",
  },
  {
    id: "rider_nit",
    name: "นิตยา ส่งเร็ว",
    phone: "0892345678",
    vehicleType: "มอเตอร์ไซค์",
    isOnline: false,
    currentOrderId: null,
    geo: { lat: 17.0495, lng: 103.0967 },
    totalEarnings: 0,
    totalDeliveries: 0,
    rating: 4.6,
    status: "active",
  },
  {
    id: "rider_boy",
    name: "บอย ไรเดอร์",
    phone: "0893456789",
    vehicleType: "มอเตอร์ไซค์",
    isOnline: false,
    currentOrderId: null,
    geo: { lat: 17.0520, lng: 103.0995 },
    totalEarnings: 0,
    totalDeliveries: 0,
    rating: 4.9,
    status: "active",
  },
];

// ============================================================
// PROMOTIONS
// ============================================================

const promotions = [
  {
    code: "WELCOME50",
    type: "fixed",
    value: 50,
    minOrder: 100,
    maxUses: 1000,
    usedCount: 0,
    expiresAt: Timestamp.fromDate(new Date("2026-12-31")),
    isActive: true,
  },
  {
    code: "FREESHIP",
    type: "fixed",
    value: 20,
    minOrder: 80,
    maxUses: 500,
    usedCount: 0,
    expiresAt: Timestamp.fromDate(new Date("2026-12-31")),
    isActive: true,
  },
];

// ============================================================
// WRITE TO FIRESTORE
// ============================================================

async function seed() {
  console.log("🌱 Seeding Firestore...");

  // Restaurants
  for (const rest of restaurants) {
    batch.set(db.collection("restaurants").doc(rest.id), {
      ...rest,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  console.log(`  ✓ ${restaurants.length} restaurants`);

  // Menus
  let menuCount = 0;
  for (const [restId, items] of Object.entries(menus)) {
    for (const item of items) {
      const ref = db.collection(`restaurants/${restId}/menu`).doc();
      batch.set(ref, item);
      menuCount++;
    }
  }
  console.log(`  ✓ ${menuCount} menu items`);

  // Riders
  for (const rider of riders) {
    batch.set(db.collection("riders").doc(rider.id), {
      ...rider,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  console.log(`  ✓ ${riders.length} riders`);

  // Promotions
  for (const promo of promotions) {
    batch.set(db.collection("promotions").doc(), promo);
  }
  console.log(`  ✓ ${promotions.length} promotions`);

  await batch.commit();
  console.log("✅ Seed complete!");
}

seed().catch(console.error);

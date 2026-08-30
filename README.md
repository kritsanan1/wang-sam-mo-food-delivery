<div align="center">

# 🍜 วังสามหมอ Food Delivery

### แพลตฟอร์มสั่งอาหารออนไลน์สำหรับชุมชนวังสามหมอ อุดรธานี

[![Expo](https://img.shields.io/badge/Expo_SDK_52-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

---

## 📱 แอพทั้งหมด

| แอพ | สำหรับ | APK | สถานะ |
|---|---|---|---|
| 🛒 **Customer** | ลูกค้าสั่งอาหาร | [ดาวน์โหลด APK](https://expo.dev/artifacts/eas/2rK7Rs4OpZovgGiK4BGsrDt2D_Rq4wEIHMhVK9NaDds.apk) | ✅ Build ผ่าน |
| 🛵 **Rider** | ไรเดอร์รับงานส่ง | [ดาวน์โหลด APK](https://expo.dev/artifacts/eas/wSxi-3XSrm7MGspDGz0d8ZpTTkAn29463kZ3JTheqKk.apk) | ✅ Build ผ่าน |
| 🏪 **Restaurant** | ร้านอาหารจัดการคำสั่ง | [ดาวน์โหลด APK](https://expo.dev/artifacts/eas/fA3Ke9ex89T0mWhQ_T021zp4qjvkesG8tYwpZZGGIqY.apk) | ✅ Build ผ่าน |
| 📊 **Admin** | ผู้ดูแลระบบ | [เปิดใช้งาน](https://wang-sam-mo-admin.expo.app) | ✅ Live |

> 💡 **ทดลองบน Expo Go:** ดาวน์โหลด [Expo Go](https://expo.dev/client) จาก Play Store แล้วสแกน QR code ในโฟลเดอร์ `design/qr-codes/`

---

## 🏗️ สถาปัตยกรรม

```
wang-sam-mo-food-delivery/
├── 📱 apps/
│   ├── customer/          — แอพลูกค้า (Expo + React Native)
│   │   ├── app/             —   หน้าจอ: Home, Login, Restaurant, Item, Cart, Checkout, Order, Profile
│   │   ├── src/
│   │   │   ├── components/   —   คอมโพเนนต์ใช้ซ้ำ
│   │   │   ├── hooks/        —   useAuth, useUserLocation
│   │   │   ├── services/     —   Firebase config
│   │   │   ├── store/        —   Cart store (Zustand)
│   │   │   └── types/        —   TypeScript types
│   │   ├── assets/          —   App icon + Splash screen
│   │   ├── __tests__/       —   Unit tests (22 tests)
│   │   └── metro.config.js   —   Path alias config
│   │
│   ├── rider/             — แอพไรเดอร์ (Expo + React Native)
│   │   ├── app/             —   หน้าจอ: Home, Job Detail, Earnings, Login
│   │   ├── src/             —   Services, types, hooks
│   │   ├── __tests__/       —   Unit tests (6 tests)
│   │   └── assets/          —   App icon + Splash screen
│   │
│   └── restaurant/        — แอพร้านอาหาร (Expo + React Native)
│       ├── app/             —   หน้าจอ: Dashboard, Menu CRUD, Reports, Login
│       ├── src/             —   Services, types, hooks
│       ├── __tests__/       —   Unit tests (5 tests)
│       └── assets/          —   App icon + Splash screen
│
├── 📊 admin/              — แดชบอร์ดแอดมิน (Next.js 14 + Tailwind)
│   ├── app/                —   7 หน้า: Dashboard, Restaurants, Riders, Orders, Promotions, Reports, Settings
│   ├── components/         —   Sidebar layout
│   └── lib/               —   Firebase client SDK
│
├── ⚡ functions/          — Cloud Functions (Firebase)
│   └── src/index.ts        —   8 functions: auto-reject, rider assign, payment, notifications
│
├── 🎨 design/             — ดีไซน์และ Mockups
│   ├── design-spec.md      —   Wireframes ทุกหน้าจอ
│   ├── figma-component-spec.md — Component library spec
│   ├── brand-guidelines.md —   โลโก้ สี ฟอนต์
│   ├── mockups.md           —   AI mockups (5 ภาพ)
│   ├── ux-ui-preview.md    —   UX/UI preview ภาพใหม่ (5 ภาพ)
│   ├── app-screenshots.md  —   สกรีนช็อต 12 หน้าจอ
│   └── qr-codes/           —   QR codes (APK + Expo Go + Poster)
│
├── 📋 docs/               — เอกสาร
│   ├── github-issues.md    —   40 issues ใน 8 epics
│   └── expo-skills-analysis.md — วิเคราะห์ Expo skills
│
├── 🌱 scripts/            — สคริปต์
│   ├── seed-firestore.ts   —   Seed data (TypeScript)
│   ├── seed-firestore.sh   —   Seed data (Bash)
│   └── seed-rest-api.py    —   Seed data (REST API) ← ใช้ตัวนี้
│
├── 🔥 firebase.json        — Firebase config
├── 🛡️ firestore.rules     — Security rules
├── 📦 firestore.indexes.json — Composite indexes
├── 🗃️ storage.rules       — Storage rules
├── 📦 eas.json            — EAS build config
└── 📖 README.md           — ไฟล์นี้
```

---

## 🚀 เริ่มใช้งาน

### 1. ติดตั้ง dependencies

```bash
# ทั้งหมด
cd apps/customer && npm install
cd apps/rider && npm install
cd apps/restaurant && npm install
cd admin && npm install
cd functions && npm install
```

### 2. รันแอพบน Expo Go

```bash
# Customer
cd apps/customer && npx expo start --tunnel

# Rider
cd apps/rider && npx expo start --tunnel

# Restaurant
cd apps/restaurant && npx expo start --tunnel
```

สแกน QR code ด้วย **Expo Go** บนมือถือ → แอพเปิดทันที!

### 3. รัน Admin Dashboard

```bash
cd admin && npm run dev      # development
cd admin && npm run build    # production build
```

ดู live ได้ที่: **https://wang-sam-mo-admin.expo.app**

### 4. รัน Unit Tests

```bash
cd apps/customer && npx jest       # 22 tests
cd apps/rider && npx jest          # 6 tests
cd apps/restaurant && npx jest     # 5 tests
```

---

## 🔥 Firebase

| รายการ | ค่า |
|---|---|
| Project ID | `wang-sam-mo-food-delivery` |
| Location | `asia-southeast1` (Singapore) |
| Console | [เปิดดู](https://console.firebase.google.com/project/wang-sam-mo-food-delivery) |
| Firestore | ✅ Rules + Indexes deployed |
| Auth | ✅ Phone OTP |
| Storage | ⏳ รอ Blaze plan |
| Cloud Functions | ⏳ รอ Blaze plan (8 functions พร้อม) |

### Seed ข้อมูลทดสอบ

```bash
python3 scripts/seed-rest-api.py
```

ข้อมูล: 5 ร้าน · 18 เมนู · 3 riders · 2 promotions

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Mobile Apps | Expo SDK 52, React Native 0.76.9, TypeScript |
| Navigation | Expo Router (Tabs + Stack) |
| State | Zustand, TanStack React Query |
| Backend | Firebase (Firestore, Auth, Functions, FCM, Storage) |
| Admin | Next.js 14, Tailwind CSS, Lucide Icons, Recharts |
| Build | Expo EAS (APK + AAB) |
| Hosting | EAS Hosting (Admin Dashboard) |
| CI/CD | GitHub Actions |
| Testing | Jest + ts-jest (33 tests) |

---

## 📊 สถานะโปรเจกต์

| ส่วน | สถานะ |
|---|---|
| Customer App | ✅ 9 หน้าจอ + Tab navigation + Auth guard |
| Rider App | ✅ 4 หน้าจอ + Auth guard |
| Restaurant App | ✅ 4 หน้าจอ + Auth guard |
| Admin Dashboard | ✅ 7 หน้าจอ + Live on EAS Hosting |
| Firestore | ✅ Seeded (5 ร้าน, 18 เมนู, 3 riders) |
| GitHub | ✅ 40 issues + โค้ดทั้งหมด |
| EAS Build | ✅ APK ทั้ง 3 แอพ |
| Unit Tests | ✅ 33 tests passing |
| App Icons | ✅ 3 แอพ + Splash screens |
| QR Codes | ✅ APK + Expo Go + Poster |
| Cloud Functions | ⏳ รอ Firebase Blaze |
| Play Store | ⏳ รอ Google Play account |

---

## 🎨 Design

- **สีหลัก:** #FF6B35 (ส้ม) · #2EC4B6 (เขียวมิ้นต์)
- **ฟอนต์:** Sarabun (ไทย) / Inter (อังกฤษ)
- **โลโก้:** ถุงส่งอาห้า + steam + location pin
- **ดู:** [`design/brand-guidelines.md`](design/brand-guidelines.md)

---

## 📦 EAS Build

```bash
# Login
eas login

# Build APK (preview)
cd apps/customer && eas build --profile preview --platform android
cd apps/rider && eas build --profile preview --platform android
cd apps/restaurant && eas build --profile preview --platform android

# Build AAB (production — for Play Store)
cd apps/customer && eas build --profile production --platform android
```

---

## 🤝 มีส่วนร่วม

1. Fork repo
2. สร้าง branch: `git checkout -b feature/ชื่อฟีเจอร์`
3. Commit: `git commit -m 'เพิ่ม ...'`
4. Push: `git push origin feature/ชื่อฟีเจอร์`
5. สร้าง Pull Request

---

## 📄 License

Private — © วังสามหมอ Food Delivery

---

<div align="center">

**สร้างด้วย ❤️ สำหรับชุมชนวังสามหมอ อุดรธานี**

</div>

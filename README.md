# วังสามหมอ Food Delivery

แอพสั่งอาหารและจัดส่งสำหรับอำเภอวังสามหมอ จังหวัดอุดรธานี  
อ้างอิง GrabFood & LINE MAN Wongnai  
Backend: Firebase | Mobile: React Native + Expo | Admin: Next.js

## โครงสร้างโปรเจกต์

```
wang-sam-mo-food-delivery/
├── apps/
│   ├── customer/      # แอพลูกค้า (React Native + Expo)
│   ├── rider/         # แอพไรเดอร์ (React Native + Expo)
│   └── restaurant/    # แอพร้านอาหาร (React Native + Expo)
├── admin/             # Admin Dashboard (Next.js)
├── functions/         # Cloud Functions (Node.js + TypeScript)
├── design/            # Design specs + wireframes
├── docs/              # PRD, architecture, API docs
└── .github/           # CI/CD workflows
```

## เริ่มต้นใช้งาน

### ติดตั้งเครื่องมือ
- Node.js 20+
- npm หรือ yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase CLI (`npm install -g firebase-tools`)

### ตั้งค่า Firebase
1. สร้าง Firebase project ที่ https://console.firebase.google.com
2. เปิดใช้: Authentication, Firestore, Cloud Functions, Cloud Messaging, Storage, Hosting
3. ดาวน์โหลด config ใส่ใน `.env` ของแต่ละแอพ

### รันแอพ
```bash
# Customer app
cd apps/customer && npm install && npx expo start

# Rider app
cd apps/rider && npm install && npx expo start

# Restaurant app
cd apps/restaurant && npm install && npx expo start

# Admin dashboard
cd admin && npm install && npm run dev

# Cloud Functions
cd functions && npm install && npm run serve
```

## ทีม
AI Agents Team — พัฒนาด้วย AI agent workflow

## License
Proprietary — © วังสามหมอ Tour Der Wang

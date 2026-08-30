# Brand Guidelines — วังสามหมอ Food Delivery

## Logo

**Main Logo:** Orange delivery bag + steam + location pin
- ดาวน์โหลด: [Customer App Logo](https://www.genspark.ai/api/files/s/FaqvesGO)
- ใช้สำหรับ: Customer app icon, marketing materials, website

## App Icons

| App | Icon | Description |
|---|---|---|
| Customer | [Logo](https://www.genspark.ai/api/files/s/FaqvesGO) | ถุงส่งอาหารส้ม + steam + pin |
| Rider | [Rider Icon](https://www.genspark.ai/api/files/s/vEV7ysue) | มอเตอร์ไซค์ + ถุงส่ง พื้นเขียวมิ้นต์ |
| Restaurant | [Restaurant Icon](https://www.genspark.ai/api/files/s/sRvqhPNY) | หมวกเชฟ/ร้าน + ชามอาหาร พื้นส้ม |

## Brand Colors

| Token | Hex | Usage |
|---|---|---|
| Primary | #FF6B35 | ส้ม — brand, header, CTA, logo |
| Secondary | #2EC4B6 | เขียวมิ้นต์ — success, rider, online |
| Dark | #1A1A2E | ตัวอักษรหลัก |
| Gray | #6C757D | ตัวอักษรรอง |
| Warning | #E71D36 | แดง — reject, cancel |
| Background | #F8F9FA | พื้นหลังแอพ |

## Typography

- **Font:** Sarabun (Thai) / Inter (English fallback)
- **Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Hierarchy:** H1 24px, H2 20px, H3 18px, Body 16px, Meta 14px, Caption 12px

## App Naming

| App | Display Name | Package ID | Slug |
|---|---|---|---|
| Customer | วังสามหมอ Food | com.wangsammo.customer | tourderwangeat |
| Rider | วังสามหมอ Rider | com.wangsammo.rider | wang-sam-mo-rider |
| Restaurant | วังสามหมอ ร้านอาหาร | com.wangsammo.restaurant | wang-sam-mo-restaurant |

## Splash Screen

- Background: #FF6B35 (Customer), #2EC4B6 (Rider), #FF6B35 (Restaurant)
- Logo: ตรงกลาง, สีขาว
- Loading: ตัว loading สีขาว 3 จุด

## Icon Usage Rules

1. อย่าบิดเบือนสี — ใช้เฉพาะค่าที่กำหนด
2. พื้นหลังโลโก้ต้องตัดขอบชัด (safe area 1024x1024)
3. ห้ามเพิ่มข้อความบน icon
4. สำหรับ Android: adaptive icon (foreground + background)
5. สำหรับ iOS: single 1024x1024 PNG, ไม่มี alpha

## การตั้งค่า App Icon ใน Expo

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B35"
    }
  }
}
```

- วาง icon.png (1024x1024) ใน `assets/` ของแต่ละแอพ
- วาง splash.png (1242x2432) ใน `assets/`
- ใส่ path ใน app.json

# GitHub Issues Breakdown — Wang Sam Mo Food Delivery

## Epic 1: Infrastructure & Setup (Week 1–2)

### Issue #1: Create Firebase Project & Configure Services
**Labels**: `infrastructure`, `P0`
**Assignee**: DevOps Agent
```
- สร้าง Firebase project ที่ console.firebase.google.com
- เปิดใช้: Authentication (Phone, Google), Firestore, Cloud Functions, Cloud Messaging, Storage, Hosting
- ตั้งค่า Firestore location: asia-southeast1 (Singapore)
- ดาวน์โหลด config สำหรับแต่ละแอพ (web/android/ios)
- ตั้งค่า Firestore security rules ตามไฟล์ firestore.rules ใน repo
- ตั้งค่า Storage rules ตามไฟล์ storage.rules
- Deploy firestore.indexes.json
- สร้าง service account key สำหรับ Cloud Functions
Acceptance: Firebase console แสดงทุก service enabled, rules deployed, indexes created
```

### Issue #2: Initialize Git Repository & CI/CD
**Labels**: `infrastructure`, `P0`
**Assignee**: DevOps Agent
```
- Push scaffold ไป GitHub repo
- ตั้งค่า GitHub Actions workflows (deploy-functions.yml, build-apps.yml)
- เพิ่ม secrets: FIREBASE_TOKEN, EXPO_TOKEN
- ตั้งค่า branch protection: main branch ต้องผ่าน CI
- ตั้งค่า Firebase Hosting deploy สำหรับ admin dashboard
Acceptance: push ไป main แล้ว CI ผ่าน, functions deploy อัตโนมัติ
```

### Issue #3: Set Up EAS Build for Mobile Apps
**Labels**: `infrastructure`, `P1`
**Assignee**: DevOps Agent
```
- สร้าง Expo EAS project สำหรับ 3 แอพ (customer, rider, restaurant)
- ตั้งค่า eas.json: development, preview, production profiles
- ทดสอบ build APK สำหรับ Android
- ตั้งค่า app signing keys
Acceptance: `eas build --profile preview --platform android` สำเร็จสำหรับทุกแอพ
```

### Issue #4: Design System & UI Components
**Labels**: `design`, `P0`
**Assignee**: Design Agent
```
- สร้าง Figma file ตาม design/design-spec.md
- Design system: colors, typography (Sarabun), spacing, border radius
- สร้าง reusable components: Button, Card, Input, Modal, Badge, Rating, CartBar, StatusTracker
- Wireframe → Hi-fi สำหรับทุกหน้าหลัก (ดู design-spec.md)
- Export assets: icons, illustrations
Acceptance: Figma file พร้อม, components ครบ, stakeholder approve
```

---

## Epic 2: Authentication & User Management (Week 3)

### Issue #5: Firebase Auth — Phone OTP (Thai Numbers)
**Labels**: `auth`, `P0`, `customer`
**Assignee**: Mobile Agent
```
- ตั้งค่า Firebase Phone Auth สำหรับเบอร์ไทย (+66)
- หน้า login: ใส่เบอร์ → ส่ง OTP → ใส่ OTP 6 หลัก → ล็อกอิน
- บัญชีใหม่: กรอกชื่อ → สร้าง user doc ใน Firestore
- บัญชีเดิม: เข้าสู่ระบบได้ทันที
- เก็บ fcmToken ใน user doc
- ทดสอบบน Android + iOS
Acceptance: ล็อกอินด้วยเบอร์ไทยได้, OTP มาภายใน 30 วินาที, user doc สร้างใน Firestore
Dependencies: #1
```

### Issue #6: Google Sign-In
**Labels**: `auth`, `P1`, `customer`
**Assignee**: Mobile Agent
```
- เพิ่ม Google Sign-In เป็นทางเลือก
- ตั้งค่า Google client IDs สำหรับ iOS + Android
- ผูกกับ Firestore user doc
Acceptance: ล็อกอินด้วย Google ได้, user doc สร้าง/อัปเดต
Dependencies: #1, #5
```

### Issue #7: Restaurant Registration & Admin Approval
**Labels**: `auth`, `P0`, `restaurant`, `admin`
**Assignee**: Backend Agent + Mobile Agent
```
- ร้านสมัคร: กรอกชื่อร้าน, เบอร์, ที่อยู่, pin แผนที่, รูปร้าน
- สร้าง restaurant doc (status=pending) + user doc (role=restaurant)
- Admin dashboard: หน้ารอ approval → approve/reject
- Approve → restaurant.status=active, ปรากฏในแอพลูกค้า
- Reject → ส่ง push แจ้งร้าน
Acceptance: ร้านสมัครได้, admin approve ได้, ร้านปรากฏในแอพลูกค้าหลัง approve
Dependencies: #1, #5
```

### Issue #8: Rider Registration & Admin Approval
**Labels**: `auth`, `P0`, `rider`, `admin`
**Assignee**: Backend Agent + Mobile Agent
```
- Rider สมัคร: ชื่อ, เบอร์, ประเภทรถ, รูปใบขับขี่
- สร้าง rider doc (status=pending) + user doc (role=rider)
- Admin dashboard: หน้ารอ approval → approve/reject
- Approve → rider.status=active
Acceptance: Rider สมัครได้, admin approve ได้
Dependencies: #1, #5
```

---

## Epic 3: Customer App — Browse & Order (Week 4–6)

### Issue #9: Home Screen — Restaurant List
**Labels**: `customer`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- ดึงร้านที่เปิดอยู่จาก Firestore (where isOpen==true)
- แสดงการ์ดร้าน: รูป, ชื่อ, rating, ค่าส่ง, ขั้นต่ำ, ระยะทาง
- คำนวณระยะทางจาก GPS ลูกค้า → ร้าน (Haversine)
- เรียงตามระยะทาง ใกล้→ไกล
- ร้านปิด: แสดงเทา + ป้าย "ปิดอยู่"
- ค้นหาร้าน/เมนู (search bar)
- กรองตามหมวดหมู่ (horizontal scroll chips)
Acceptance: ลูกค้าเห็นร้านใกล้ตัว, ค้นหา/กรองได้
Dependencies: #4, #5
```

### Issue #10: Restaurant Detail — Menu View
**Labels**: `customer`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- ดึงเมนูจาก subcollection restaurants/{id}/menu
- แสดงเมนูแบบหมวดหมู่
- แต่ละ item: รูป, ชื่อ, ราคา, คำอธิบาย, ป้าย "หมด" ถ้า isAvailable=false
- แตะ item → เปิด Item Detail modal
Acceptance: ลูกค้าดูเมนูร้านได้ครบ
Dependencies: #9
```

### Issue #11: Item Detail — Options & Add to Cart
**Labels**: `customer`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- แสดง options: ขนาด (radio), ท็อปปิ้ง (checkbox), ระดับเผ็ด (radio)
- คำนวณราคาตาม options ที่เลือกแบบ real-time
- หมายเหตุ: text input
- จำนวน: - / + stepper
- ปุ่ม "เพิ่มลงรถเข็น" → CartStore.addItem()
- เปลี่ยนร้าน → ถาม confirm เคลียร์รถเข็นเดิม
Acceptance: เลือก options ได้, ราคาคำนวณถูก, เพิ่มลงรถเข็นได้
Dependencies: #10
```

### Issue #12: Cart View
**Labels**: `customer`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- แสดงรายการในรถเข็น
- แก้ไขจำนวน / ลบ item
- แสดงยอดรวม + ค่าส่ง
- ตรวจสอบยอดขั้นต่ำ (minOrder)
- ปุ่ม "สั่งซื้อ" → ไป checkout
Acceptance: จัดการรถเข็นได้, ตรวจสอบขั้นต่ำได้
Dependencies: #11
```

### Issue #13: Checkout — Address, Payment, Place Order
**Labels**: `customer`, `P0`, `feature`
**Assignee**: Mobile Agent + Backend Agent
```
- เลือก/เพิ่มที่อยู่ (เบอร์, ชื่อ, ที่อยู่, pin แผนที่)
- สรุปยอด: อาหาร + ค่าส่ง - ส่วนลด = รวม
- ใส่รหัสโปรโมชัน
- เลือกวิธีชำระ: PromptPay QR / COD
- สร้าง order doc ใน Firestore (status=pending)
- PromptPay: เรียก Cloud Function สร้าง QR → แสดง QR
- ส่ง push ไปร้าน (Cloud Function trigger)
- ไปหน้า Order Tracking
Acceptance: สั่งซื้อได้ end-to-end, order doc สร้าง, ร้านได้รับ push
Dependencies: #12, #5, #7
```

### Issue #14: Order Tracking — Real-time Status
**Labels**: `customer`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- Firestore real-time listener บน order doc
- Progress bar 5 ขั้นตอน (pending → delivered)
- สถานะ picked_up: แสดงชื่อ/เบอร์ rider + ปุ่มโทร
- สถานะ delivered: ขอ rate & review
- ประวัติคำสั่งใน tab "คำสั่งของฉัน"
Acceptance: สถานะอัปเดต real-time, ประวัติครบ
Dependencies: #13
```

### Issue #15: Push Notifications (FCM)
**Labels**: `customer`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- ตั้งค่า FCM ในแอพ
- รับ push: คำสั่งใหม่, สถานะเปลี่ยน, โปรโมชัน
- แตะ notification → เปิดแอพที่หน้าที่เกี่ยวข้อง
- ตั้งค่า notification preferences (เปิด/ปิดโปร)
Acceptance: ลูกค้าได้รับ push ทุกสถานะ, แตะแล้วเปิดหน้าที่ใช่
Dependencies: #5, #14
```

### Issue #16: Rate & Review
**Labels**: `customer`, `P1`, `feature`
**Assignee**: Mobile Agent
```
- หลัง delivered: popup ขอ rate (1-5 ดาว) + review (text)
- ให้คะแนนร้าน + rider แยกกัน
- บันทึกใน order doc + อัปเดต rating เฉลี่ยร้าน/rider
Acceptance: ลูกค้าให้คะแนนได้, rating อัปเดต
Dependencies: #14
```

---

## Epic 4: Restaurant App (Week 5–7)

### Issue #17: Restaurant Dashboard
**Labels**: `restaurant`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- แสดงชื่อร้าน + toggle เปิด/ปิด
- สถิติวันนี้: จำนวนคำสั่ง, ยอดขาย
- รายการคำสั่งใหม่ (status=pending) แบบ real-time
- แท็บ: คำสั่งทั้งหมด / เมนู / รายงาน
Acceptance: ร้านเห็นคำสั่ง real-time, เปิด/ปิดร้านได้
Dependencies: #7
```

### Issue #18: Accept/Reject Orders
**Labels**: `restaurant`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- คำสั่งใหม่: push + เสียงดัง + หน้าจอเต็ม
- แสดงรายละเอียด: อาหาร, options, notes, ที่อยู่, เบอร์, ยอด
- ปุ่ม รับ (เขียว) / ปฏิเสธ (แดง)
- รับ → status=accepted → push ลูกค้า
- ปฏิเสธ → status=rejected → push ลูกค้า + คืนเงิน (ถ้าจ่ายแล้ว)
- Auto-reject ถ้าไม่กดใน 3 นาที (Cloud Function)
Acceptance: ร้านรับ/ปฏิเสธได้, ลูกค้าได้รับ push
Dependencies: #17, #13
```

### Issue #19: Update Order Status
**Labels**: `restaurant`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- ปุ่ม "พร้อมส่ง" → status=ready → Cloud Function หา rider
- แสดง rider ที่รับงาน (ชื่อ, เบอร์)
- ประวัติคำสั่งทั้งหมด กรองตามวัน/สถานะ
Acceptance: ร้านอัปเดตสถานะได้, rider ได้รับ push
Dependencies: #18
```

### Issue #20: Menu Management CRUD
**Labels**: `restaurant`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- เพิ่ม item: ชื่อ, ราคา, รูป (อัปโหลด Firebase Storage), หมวดหมู่, คำอธิบาย
- เพิ่ม options: ขนาด, ท็อปปิ้ง, ระดับเผ็ด — แต่ละ choice มี priceAdd
- แก้ไข/ลบ item
- ซ่อน/แสดง item (isAvailable toggle) แบบรวดเร็ว
- การเปลี่ยนแปลงส่งผลทันที (Firestore real-time)
Acceptance: ร้านจัดการเมนูได้ครบ, ลูกค้าเห็นการเปลี่ยนแปลงทันที
Dependencies: #7
```

### Issue #21: Restaurant Sales Report
**Labels**: `restaurant`, `P1`, `feature`
**Assignee**: Mobile Agent + Backend Agent
```
- ยอดขาย: วันนี้ / สัปดาห์ / เดือน
- จำนวนคำสั่ง, ยอดรวม, ค่าคอมมิชชัน, ยอดสุทธิ
- Top 5 เมนูขายดี
- กราฟแท่ง: ยอดขาย 7 วัน
Acceptance: ร้านเห็นรายงานยอดขายถูกต้อง
Dependencies: #17
```

---

## Epic 5: Rider App (Week 7–8)

### Issue #22: Rider Online/Offline + GPS
**Labels**: `rider`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- Toggle ออนไลน์/ออฟไลน์
- ออนไลน์: ส่ง GPS ไป Firestore ทุก 10 วินาที (expo-location background)
- ออฟไลน์: หยุดส่ง GPS, ไม่รับงานใหม่
- แสดงสถานะปัจจุบัน
Acceptance: GPS ส่งได้ตลอด, toggle ทำงาน
Dependencies: #8
```

### Issue #23: Receive & Accept Delivery Jobs
**Labels**: `rider`, `P0`, `feature`
**Assignee**: Mobile Agent + Backend Agent
```
- รับ push งานใหม่จาก Cloud Function (onOrderReady)
- Popup: ร้าน, ที่หมาย, ระยะทาง, ค่าส่ง, countdown 15 วินาที
- ปุ่ม รับ / ปฏิเสธ
- รับ → riderId=me, currentOrderId=orderId → push ลูกค้า + ร้าน
Acceptance: Rider รับงานได้, ลูกค้า/ร้านได้รับ push
Dependencies: #22, #19
```

### Issue #24: Delivery Workflow & Navigation
**Labels**: `rider`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- หน้างาน: รายการอาหาร, ที่อยู่ร้าน, ที่อยู่ลูกค้า
- ปุ่ม "ถึงร้านแล้ว"
- ปุ่ม "รับอาหารแล้ว" → status=picked_up → push ลูกค้า
- ปุ่ม "นำทาง" → เปิด Google Maps deep link
- ปุ่ม "ส่งถึงแล้ว" → status=delivered → คำนวณรายได้
- กลับสู่หน้ารองาน
Acceptance: Rider ทำงานส่งครบวงจร
Dependencies: #23
```

### Issue #25: Rider Earnings
**Labels**: `rider`, `P1`, `feature`
**Assignee**: Mobile Agent
```
- รายได้: วันนี้ / สัปดาห์ / เดือน
- จำนวนงานส่ง, รายได้รวม
- ประวัติงานส่งทั้งหมด
Acceptance: Rider เห็นรายได้ถูกต้อง
Dependencies: #24
```

---

## Epic 6: Admin Dashboard (Week 7–8)

### Issue #26: Admin Dashboard — Overview
**Labels**: `admin`, `P0`, `feature`
**Assignee**: Frontend Agent
```
- สถิติ: ร้านทั้งหมด, rider ทั้งหมด, คำสั่งวันนี้, GMV
- กราฟ: คำสั่ง/วัน (7d, 30d), ยอด/ร้าน, คำสั่ง/ชั่วโมง
- ตารางคำสั่งล่าสุด (real-time Firestore listener)
- Sidebar: Dashboard, ร้าน, Rider, คำสั่ง, รายงาน, โปรโมชัน
Acceptance: Admin เห็นภาพรวมแพลตฟอร์ม real-time
Dependencies: #2
```

### Issue #27: Admin — Restaurant Management
**Labels**: `admin`, `P0`, `feature`
**Assignee**: Frontend Agent
```
- รายการร้าน: ค้นหา, กรอง, แบ่งหน้า
- รอ approval: approve / reject
- แก้ไขข้อมูลร้าน, ตั้งค่าคอมมิชชัน
- ปิด/พักร้าน (ban)
- ดูสถิติร้าน
Acceptance: Admin จัดการร้านได้ครบ
Dependencies: #26, #7
```

### Issue #28: Admin — Rider Management
**Labels**: `admin`, `P0`, `feature`
**Assignee**: Frontend Agent
```
- รายการ rider: ค้นหา, กรอง
- รอ approval: approve / reject
- ดูสถิติ rider: งานส่ง, rating, รายได้
- ปิด/พัก rider
Acceptance: Admin จัดการ rider ได้ครบ
Dependencies: #26, #8
```

### Issue #29: Admin — Orders Real-time Monitor
**Labels**: `admin`, `P0`, `feature`
**Assignee**: Frontend Agent
```
- ตาราง real-time: orderId, ร้าน, ลูกค้า, rider, สถานะ, เวลา, ยอด
- กรองตามสถานะ, ร้าน, วันที่
- ดูรายละเอียดคำสั่งเต็ม
- แทรกแซน: ยกเลิกคำสั่ง, เปลี่ยน rider
Acceptance: Admin ติดตามและจัดการคำสั่งได้
Dependencies: #26
```

### Issue #30: Admin — Promotions Management
**Labels**: `admin`, `P1`, `feature`
**Assignee**: Frontend Agent
```
- สร้างโปร: รหัส, ประเภท (% หรือ บาท), มูลค่า, ยอดขั้นต่ำ, จำนวนใช้สูงสุด, วันหมดอายุ
- โปรทั้งแพลตฟอร์ม หรือเฉพาะร้าน
- ดู usage: ใช้ไปกี่ครั้ง, ลดยอดไปเท่าไหร่
- ปิด/ลบโปร
Acceptance: Admin สร้าง/จัดการโปรได้
Dependencies: #26
```

### Issue #31: Admin — Reports & Analytics
**Labels**: `admin`, `P1`, `feature`
**Assignee**: Frontend Agent
```
- รายงานคอมมิชชัน: รายได้แพลตฟอร์ม
- รายงานร้าน: ยอดขาย, คำสั่ง, rating
- รายงาน rider: งานส่ง, รายได้, rating
- ส่งออก CSV
Acceptance: Admin ดู/ส่งออกรายงานได้
Dependencies: #26
```

---

## Epic 7: Payment Integration (Week 8)

### Issue #32: PromptPay QR Integration
**Labels**: `payment`, `P0`, `feature`
**Assignee**: Backend Agent
```
- เลือก payment gateway: Omise หรือ Stripe Thailand
- Cloud Function: สร้าง PromptPay QR จากยอดคำสั่ง
- แสดง QR ในแอพลูกค้า
- Webhook: รับ notification เมื่อลูกค้าโอนสำเร็จ
- อัปเดต order.paymentStatus = paid
- ส่ง push ร้าน "ได้รับเงินแล้ว"
Acceptance: ลูกค้าชำระผ่าน PromptPay ได้, ร้านได้รับแจ้ง
Dependencies: #13, #1
```

### Issue #33: Cash on Delivery (COD)
**Labels**: `payment`, `P0`, `feature`
**Assignee**: Mobile Agent
```
- เลือก COD ใน checkout
- สร้าง order โดย paymentStatus=pending (เก็บเงินปลายทาง)
- Rider กด "ส่งถึงแล้ว" → ถาม "ได้รับเงินหรือไม่?" (Y/N)
- Y → paymentStatus=paid, คำนวณรายได้
- N → บันทึก paymentStatus=failed, แจ้ง admin
Acceptance: COD ทำงานครบวงจร
Dependencies: #13, #24
```

### Issue #34: Refund Logic
**Labels**: `payment`, `P1`, `feature`
**Assignee**: Backend Agent
```
- ร้านปฏิเสธ/ยกเลิกคำสั่งที่จ่ายแล้ว → trigger refund
- Cloud Function: เรียก payment gateway refund API
- อัปเดต order.paymentStatus = refunded
- ส่ง push ลูกค้า "คืนเงินแล้ว"
Acceptance: คืนเงินได้, ลูกค้าได้รับแจ้ง
Dependencies: #32
```

---

## Epic 8: Polish & Launch (Week 9–12)

### Issue #35: Firebase Analytics & Crashlytics
**Labels**: `infra`, `P1`
**Assignee**: DevOps Agent
```
- เพิ่ม Firebase Analytics events: order_placed, order_completed, restaurant_signup, rider_online
- เพิ่ม Crashlytics ในทุกแอพ
- สร้าง funnel: signup → browse → order → delivered
Acceptance: Events ส่งไป Firebase, Crashlytics จับ error ได้
Dependencies: all P0 issues
```

### Issue #36: Thai Language i18n
**Labels**: `i18n`, `P1`
**Assignee**: Mobile Agent
```
- ตั้งค่า i18n (expo-localization + i18n-js)
- ภาษาไทยเป็น default
- ทุกหน้าใช้ i18n keys
- เตรียม English สำหรับอนาคต
Acceptance: แอพแสดงภาษาไทยทั้งหมด
Dependencies: all P0 issues
```

### Issue #37: Offline Persistence
**Labels**: `reliability`, `P1`
**Assignee**: Mobile Agent
```
- เปิด Firestore offline persistence
- Cache ร้าน/เมนูล่าสุด
- แสดง cached data เมื่อ offline
- แสดง banner "ไม่มีอินเทอร์เน็ต"
Acceptance: แอพใช้ได้บางส่วนเมื่อ offline
Dependencies: all P0 issues
```

### Issue #38: QA & Bug Fixing
**Labels**: `qa`, `P0`
**Assignee**: QA Agent
```
- ทดสอบ end-to-end: สั่ง → รับ → ทำ → ส่ง → ได้เงิน
- ทดสอบ edge cases: ร้านปิด, rider offline, ไม่มี rider, ชำระล้มเหลว
- ทดสอบบน Android จริง + iOS จริง
- บันทึก bugs ใน GitHub issues
- Regression test
Acceptance: <5% error rate, ทุก P0 ผ่าน
Dependencies: all P0 issues
```

### Issue #39: Beta Test with 10-20 Restaurants
**Labels**: `launch`, `P0`
**Assignee**: PM Agent
```
- คัด 10-20 ร้านในวังสามหมอ
- ติดตั้งแอพร้าน + สอนใช้งาน
- ทดสอบจริง 1 สัปดาห์
- เก็บ feedback: UX, bug, ฟีเจอร์ขาด
- แก้ bugs จาก feedback
Acceptance: ร้านใช้งานจริงได้, feedback แก้แล้ว
Dependencies: #38
```

### Issue #40: Soft Launch
**Labels**: `launch`, `P0`
**Assignee**: PM Agent
```
- เปิดให้ลูกค้าในวังสามหมอใช้จริง
- โปร: ส่งฟรี 7 วันแรก
- ทำการตลาด: Facebook + LINE OA + ป้ายหน้าร้าน
- ติดตาม metrics รายวัน: คำสั่ง, completion rate, avg delivery time, rating
- Daily standup กับทีม
Acceptance: 100+ คำสั่ง/วัน, completion rate >90%
Dependencies: #39
```

---

## Summary

| Epic | Issues | Priority |
|---|---|---|
| Infrastructure & Setup | 4 | P0 |
| Auth & User Management | 4 | P0 |
| Customer App | 8 | P0+P1 |
| Restaurant App | 5 | P0+P1 |
| Rider App | 4 | P0+P1 |
| Admin Dashboard | 6 | P0+P1 |
| Payment | 3 | P0+P1 |
| Polish & Launch | 6 | P0+P1 |
| **Total** | **40** | |

## Assignment Guide (AI Agent Team)

| Agent | Issues |
|---|---|
| DevOps Agent | #1, #2, #3, #35 |
| Design Agent | #4 |
| Backend Agent | #7, #8, #13(backend), #21(backend), #32, #34 |
| Mobile Agent (Customer) | #5, #6, #9, #10, #11, #12, #13, #14, #15, #16 |
| Mobile Agent (Restaurant) | #17, #18, #19, #20, #21 |
| Mobile Agent (Rider) | #22, #23, #24, #25 |
| Frontend Agent (Admin) | #26, #27, #28, #29, #30, #31 |
| QA Agent | #38, #39 |
| PM Agent | #39, #40 |

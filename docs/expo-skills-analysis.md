# Expo Skills — การประยุกต์ใช้กับโปรเจกต์วังสามหมอ Food Delivery

## สรุป Skills ที่ติดตั้ง (26 skills)

### ที่ใช้ได้ทันทีกับโปรเจกต์เรา:

1. **expo-overview** — Entry point สำหรับทุก Expo/EAS task
2. **expo-project-structure** — โครงสร้างโฟลเดอร์ (src/app, src/components, src/screens)
3. **expo-router** — Navigation: file-based routes, tabs, modals, headers
4. **expo-native-ui** — Native-feeling UI, semantic colors, SF Symbols
5. **expo-data-fetching** — React Query, caching, offline, Firebase patterns
6. **expo-design-system** — Design tokens, component conventions, drift audits
7. **eas-app-stores** — Build & submit to App Store / Play Store
8. **eas-workflows** — CI/CD automation with EAS Workflows
9. **expo-upgrade** — SDK upgrades, dependency conflicts
10. **expo-dev-client** — Custom development builds

### สิ่งที่ควรปรับปรุงในโปรเจกต์:

#### 1. โครงสร้างโปรเจกต์ (expo-project-structure)
- ปัจจุบัน: routes อยู่ใน `app/` โดยตรง, components ใน `src/components/`
- ควรเป็น: `src/app/` (routes-only), `src/components/` (reusable), `src/screens/` (screen bodies)
- แต่เนื่องจาก skills ระบุชัด: "Apply only to new projects. If the app already has a layout, follow its existing conventions"
- **สรุป**: ไม่ต้องย้าย ใช้โครงสร้างเดิมต่อไป

#### 2. Navigation (expo-router)
- ปัจจุบัน: ใช้ Stack navigation เท่านั้น
- ควรเพิ่ม: NativeTabs สำหรับ Customer app (หน้าแรก, คำสั่ง, โปรไฟล์)
- ควรเพิ่ม: Modal/Sheet สำหรับ Item Detail แทนหน้าเต็ม

#### 3. Data Fetching (expo-data-fetching)
- ปัจจุบัน: ใช้ React Query กับ Firebase Firestore อยู่แล้ว ✅
- ควรเพิ่ม: Offline persistence, NetInfo, AbortController
- ควรใช้: `useLoaderData` สำหรับ web

#### 4. EAS Deployment (eas-app-stores)
- ปัจจุบัน: Build APK สำเร็จแล้ว 3 แอพ ✅
- ขั้นต่อไป: Production build (AAB for Play Store), store metadata, versioning
- ควรตั้งค่า: eas.json production profile, submit profiles

#### 5. UI Improvements (expo-native-ui)
- ควรใช้: Semantic colors (light/dark mode support)
- ควรเพิ่ม: expo-haptics สำหรับ feedback
- ควรใช้: Reanimated สำหรับ animations

## การประยุกต์ใช้ทันที:
1. เพิ่ม NativeTabs ใน Customer app
2. ปรับ Firebase data fetching ให้มี offline support
3. เตรียม eas.json สำหรับ production build

# Figma Component Library Spec

## Design Tokens

### Colors
```
Primary:    #FF6B35 (ส้ม — brand, header, CTA)
Secondary:  #2EC4B6 (เขียวมิ้นต์ — success, online, accept)
Dark:       #1A1A2E (ตัวอักษรหลัก)
Gray:       #6C757D (ตัวอักษรรอง)
Light Gray: #ADB5BD (disabled, placeholder)
Warning:    #E71D36 (แดง — reject, cancel, error)
Background: #F8F9FA
White:      #FFFFFF
Card BG:    #FFFFFF
Chip BG:    #FFF5F0 (ส้มอ่อน)
Success BG: #D4EDDA
Danger BG:  #F8D7DA
Warning BG: #FFF3CD
```

### Typography
```
Font Family: Sarabun (Thai) / Inter (EN fallback)
Weights: 400 Regular, 500 Medium, 600 SemiBold, 700 Bold

Sizes:
  H1:     24px / Bold    — page titles
  H2:     20px / Bold    — section titles
  H3:     18px / SemiBold — card titles
  Body:   16px / Regular — main text
  Meta:   14px / Regular — secondary info
  Caption: 12px / Medium — badges, labels
  Price:  20px / Bold    — prices (color: Primary)
```

### Spacing
```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
xxl: 32px
```

### Border Radius
```
sm: 8px (chips, small buttons)
md: 12px (cards, inputs, buttons)
lg: 16px (modals, large cards)
full: 999px (badges, avatars, toggles)
```

### Shadows
```
card:   elevation: 2, shadowOpacity: 0.1, shadowRadius: 4
modal:  elevation: 8, shadowOpacity: 0.15, shadowRadius: 12
```

## Components

### 1. Button
```
Variants: primary (#FF6B35), secondary (#2EC4B6), danger (#E71D36), ghost (transparent)
Size: md (padding 16, font 16), lg (padding 18, font 18)
Shape: rounded 12px
State: default, pressed, disabled (opacity 0.5)
```

### 2. Restaurant Card
```
Container: white bg, rounded 12, shadow card
Image: 100% width, 160px height, top
Info: padding 14
  - Name: H3 / Dark
  - Rating + fee + min: Meta / Gray
  - Distance: Meta / Secondary
  - Categories: chips (3 max)
Closed state: gray overlay + "ปิดอยู่" badge
```

### 3. Menu Item Row
```
Container: white bg, border-bottom 1px #F0F0F0
Layout: flex-row (info flex:1 + image 80x80)
Info:
  - Name: Body SemiBold / Dark
  - Description: Meta / Gray
  - Price: Body Bold / Primary
Unavailable: gray text + "หมด" badge
```

### 4. Cart Item
```
Container: white bg, rounded 12, padding 16
Layout: flex-row (info flex:1 + remove button)
Info:
  - Name: Body SemiBold
  - Options: Caption / Gray
  - Notes: Caption italic / Gray
  - Price: Body Bold / Primary
Qty stepper: - [count] + (circles 32x32)
```

### 5. Status Tracker (Order Tracking)
```
Steps: pending → accepted → preparing → ready → picked_up → delivered
Circle: 32x32, done=#2EC4B6 with ✓, pending=#E0E0E0 with number
Line: 2px wide, done=#2EC4B6, pending=#E0E0E0
Label: Meta / Gray (done: Dark SemiBold)
```

### 6. Search Bar
```
Container: white bg, rounded 12, padding 12
Placeholder: "🔍 ค้นหาร้าน / เมนู..."
Font: Body / Gray
```

### 7. Category Chip
```
Container: rounded 16, padding H14 V6
Default: bg #F8F9FA, text #6C757D
Active: bg #FF6B35, text #FFFFFF
```

### 8. Toggle Switch
```
Track: 52x32, rounded full
On: #2EC4B6, Off: #E0E0E0
Knob: 28x28 white circle
```

### 9. Bottom Tab Bar (Customer)
```
3 tabs: หน้าแรก (🏠) | คำสั่ง (📋) | โปรไฟล์ (👤)
Height: 60px + safe area
Active: #FF6B35, Inactive: #6C757D
Badge: cart count on หน้าแรก tab
```

### 10. Order Card (Admin/Restaurant)
```
Container: white bg, rounded 12, padding 16
Header: #ID + status badge (color-coded)
Items: bullet list
Footer: address + phone + total
Actions: accept (green) / reject (red) / ready (orange)
```

### 11. Stat Card (Admin)
```
Container: white bg, rounded 12, padding 16, shadow
Label: Meta / Gray (top)
Value: H1 / colored (bottom)
```

### 12. Modal Sheet
```
Overlay: rgba(0,0,0,0.5)
Content: white bg, rounded 16 top, padding 24
Max height: 80% screen
```

## Screen Layouts (Phone: 390x844)

### Safe Areas
```
Top: 50px (status bar + header)
Bottom: 34px (home indicator)
```

### Header Pattern
```
Height: auto (padding top 50)
BG: Primary (#FF6B35)
Title: H1 / White
Subtitle: Meta / White opacity 0.9
Back button: "‹ กลับ" / White (when applicable)
```

### Footer/CTA Pattern
```
Fixed bottom
BG: White
Border-top: 1px #E0E0E0
Padding: 16
Button: full width, primary
```

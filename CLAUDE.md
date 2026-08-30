# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📱 Common Development Commands

### Dependency Installation
```bash
# Install dependencies for all apps and admin
cd apps/customer && npm install
cd apps/rider && npm install
cd apps/restaurant && npm install
cd admin && npm install
cd functions && npm install
```

### Running Applications
```bash
# Customer app (Expo Go)
cd apps/customer && npx expo start --tunnel

# Rider app (Expo Go)
cd apps/rider && npx expo start --tunnel

# Restaurant app (Expo Go)
cd apps/restaurant && npx expo start --tunnel

# Admin dashboard (development)
cd admin && npm run dev

# Admin dashboard (production build)
cd admin && npm run build
```

### Testing
```bash
# Customer app tests
cd apps/customer && npx jest

# Rider app tests
cd apps/rider && npx jest

# Restaurant app tests
cd apps/restaurant && npx jest
```

### Data Seeding
```bash
# Seed test data to Firestore
python3 scripts/seed-rest-api.py
```

### EAS Build (Expo Application Service)
```bash
# Login to EAS
eas login

# Build preview APK for customer app
cd apps/customer && eas build --profile preview --platform android

# Build preview APK for rider app
cd apps/rider && eas build --profile preview --platform android

# Build preview APK for restaurant app
cd apps/restaurant && eas build --profile preview --platform android

# Build production AAB (for Google Play Store)
cd apps/customer && eas build --profile production --platform android
```

## 🏗️ Code Architecture & Structure

### Monorepo Organization
```
wang-sam-mo-food-delivery/
├── apps/                 # Mobile applications (Expo + React Native)
│   ├── customer/         # Customer food ordering app
│   │   ├── app/          # Expo Router screens (Home, Login, Restaurant, Item, Cart, Checkout, Order, Profile)
│   │   ├── src/          # Source code
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── hooks/        # Custom hooks (useAuth, useUserLocation)
│   │   │   ├── services/     # Firebase configuration and services
│   │   │   ├── store/        # Zustand state management (cart)
│   │   │   └── types/        # TypeScript interfaces and types
│   │   ├── assets/         # App icons and splash screens
│   │   ├── __tests__/      # Unit tests (Jest)
│   │   └── metro.config.js # Metro bundler configuration (path aliases)
│   │
│   ├── rider/            # Rider delivery app
│   │   ├── app/          # Screens (Home, Job Detail, Earnings, Login)
│   │   ├── src/          # Services, types, hooks
│   │   ├── __tests__/    # Unit tests
│   │   └── assets/       # App icon and splash screen
│   │
│   └── restaurant/       # Restaurant management app
│       ├── app/          # Screens (Dashboard, Menu CRUD, Reports, Login)
│       ├── src/          # Services, types, hooks
│       ├── __tests__/    # Unit tests
│       └── assets/       # App icon and splash screen
│
├── admin/                # Admin dashboard (Next.js 14 + Tailwind)
│   ├── app/              # 7 pages: Dashboard, Restaurants, Riders, Orders, Promotions, Reports, Settings
│   ├── components/       # Sidebar layout and shared components
│   └── lib/              # Firebase client SDK initialization
│
├── functions/            # Firebase Cloud Functions (TypeScript)
│   └── src/index.ts      # 8 functions: auto-reject, rider assignment, payment handling, notifications
│
├── design/               # Design assets and specifications
│   ├── design-spec.md        # Wireframes for all screens
│   ├── figma-component-spec.md # Component library specification
│   ├── brand-guidelines.md   # Logo, colors, fonts
│   ├── mockups.md            # AI-generated mockups (5 images)
│   ├── ux-ui-preview.md      # UX/UI preview (5 images)
│   ├── app-screenshots.md    # 12 app screenshots
│   └── qr-codes/             # QR codes for APK download, Expo Go, and poster
│
├── docs/                 # Project documentation
│   ├── github-issues.md      # 40 issues across 8 epics
│   └── expo-skills-analysis.md # Analysis of Expo skills used
│
├── scripts/              # Data seeding scripts
│   ├── seed-firestore.ts   # TypeScript seed script
│   ├── seed-firestore.sh   # Bash seed script
│   └── seed-rest-api.py    # Python seed script (primary)
│
├── firebase.json         # Firebase project configuration
├── firestore.rules       # Firestore security rules
├── firestore.indexes.json # Firestore composite indexes
├── storage.rules         # Firebase Storage security rules
└── eas.json              # Expo Application Services build configuration
```

### Key Technologies
- **Mobile Apps**: Expo SDK 52, React Native 0.76.9, TypeScript
- **Navigation**: Expo Router (file-based routing with tabs and stacks)
- **State Management**: 
  - Zustand (customer app cart)
  - TanStack React Query (server state)
- **Backend**: Firebase (Firestore, Auth, Cloud Functions, FCM)
- **Admin Dashboard**: Next.js 14, Tailwind CSS, Lucide Icons, Recharts
- **Build System**: Expo EAS (APK/AAB generation)
- **Hosting**: EAS Hosting (admin dashboard)
- **Testing**: Jest with ts-jest (33 unit tests total)
- **CI/CD**: GitHub Actions

### Development Workflow
1. Create feature branch: `git checkout -b feature/description`
2. Implement changes in respective app/admin/functions directories
3. Write/update unit tests in `__tests__` directories
4. Run tests locally: `npm test` or `npx jest` in the relevant directory
5. Commit changes: `git commit -m 'description'`
6. Push to fork and create Pull Request

### Important Notes
- All mobile apps use Expo Router for navigation - screens are defined in the `app/` directory
- Firebase configuration is centralized in the `functions/src/` directory and referenced by mobile apps and admin
- Authentication uses Firebase Phone OTP across all applications
- The admin dashboard is hosted via EAS Hosting and built with Next.js 14 App Router
- Seed data script (`scripts/seed-rest-api.py`) populates Firestore with test data (5 restaurants, 18 menu items, 3 riders, 2 promotions)
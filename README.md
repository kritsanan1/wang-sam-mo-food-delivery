# วังสามหมอ Food Delivery

Food delivery platform for Wang Sam Mo district, Udon Thani, Thailand.
Built with Firebase, React Native (Expo), and Next.js.

## Architecture

```
├── apps/
│   ├── customer/     — Customer mobile app (Expo + React Native)
│   ├── rider/        — Rider mobile app (Expo + React Native)
│   └── restaurant/   — Restaurant mobile app (Expo + React Native)
├── admin/            — Admin dashboard (Next.js + Tailwind)
├── functions/        — Cloud Functions (Firebase)
├── design/           — Design spec & wireframes
├── docs/             — GitHub issues breakdown
├── scripts/          — Seed data & utilities
├── firebase.json     — Firebase config
├── firestore.rules   — Firestore security rules
├── storage.rules     — Storage security rules
└── eas.json          — Expo EAS build config
```

## Firebase Project

- **Project ID:** `wang-sam-mo-food-delivery`
- **Location:** `asia-southeast1` (Singapore)
- **Console:** https://console.firebase.google.com/project/wang-sam-mo-food-delivery

## Setup

### 1. Install dependencies

```bash
# Root
npm run setup

# Or individual:
cd apps/customer && npm install
cd apps/rider && npm install
cd apps/restaurant && npm install
cd admin && npm install
cd functions && npm install
```

### 2. Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase use wang-sam-mo-food-delivery
```

### 3. Deploy Firestore rules & indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 4. Deploy Cloud Functions (requires Blaze plan)

```bash
firebase deploy --only functions
```

### 5. Deploy Storage (requires setup in console)

```bash
firebase deploy --only storage
```

### 6. Seed test data

```bash
cd scripts
npx tsx seed-firestore.ts
```

## Running the apps

### Customer app

```bash
cd apps/customer
npx expo start
```

### Rider app

```bash
cd apps/rider
npx expo start
```

### Restaurant app

```bash
cd apps/restaurant
npx expo start
```

### Admin dashboard

```bash
cd admin
npm run dev    # development
npm run build  # production build
```

## GitHub

- **Repo:** https://github.com/kritsanan1/wang-sam-mo-food-delivery
- **Issues:** 40 issues across 8 epics

## Tech Stack

| Component | Technology |
|---|---|
| Mobile apps | Expo SDK 52, React Native, TypeScript |
| State | Zustand, TanStack React Query |
| Backend | Firebase (Firestore, Auth, Functions, FCM, Storage) |
| Admin | Next.js 14, Tailwind CSS, Lucide Icons |
| CI/CD | GitHub Actions |
| Build | Expo EAS |

## License

Private — Wang Sam Mo Food Delivery

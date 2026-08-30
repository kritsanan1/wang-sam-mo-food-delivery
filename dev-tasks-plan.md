# Development Tasks Plan

## Global Constraints
- All commands should be run from the repository root unless specified
- Use npm/yarn/pnpm as appropriate for each project
- Expo commands should use npx expo
- Testing should use Jest
- Data seeding should use the Python script
- EAS builds should follow the documented process

## Tasks

### Task 1: Dependency Installation
Install dependencies for all applications and services:
- Customer app: cd apps/customer && npm install
- Rider app: cd apps/rider && npm install
- Restaurant app: cd apps/restaurant && npm install
- Admin dashboard: cd admin && npm install
- Cloud functions: cd functions && npm install

### Task 2: Running Applications
Document how to run each application:
- Customer app: cd apps/customer && npx expo start --tunnel
- Rider app: cd apps/rider && npx expo start --tunnel
- Restaurant app: cd apps/restaurant && npx expo start --tunnel
- Admin dashboard (dev): cd admin && npm run dev
- Admin dashboard (build): cd admin && npm run build

### Task 3: Testing
Document how to run tests for each application:
- Customer app tests: cd apps/customer && npx jest
- Rider app tests: cd apps/rider && npx jest
- Restaurant app tests: cd apps/restaurant && npx jest

### Task 4: Data Seeding
Document how to seed test data:
- Run the Python seeding script: python3 scripts/seed-rest-api.py

### Task 5: EAS Builds
Document how to build applications using Expo Application Services:
- Login to EAS: eas login
- Build preview APK for customer app: cd apps/customer && eas build --profile preview --platform android
- Build preview APK for rider app: cd apps/rider && eas build --profile preview --platform android
- Build preview APK for restaurant app: cd apps/restaurant && eas build --profile preview --platform android
- Build production AAB for customer app: cd apps/customer && eas build --profile production --platform android
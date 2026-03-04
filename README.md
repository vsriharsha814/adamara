# AdAmara

Next.js app for ad requests. Uses Firebase (Auth + Firestore). Admin at `/admin/login` (Google sign-in; access must be approved).

## Setup

```bash
cp .env.sample .env
# Edit .env with your Firebase config (NEXT_PUBLIC_FIREBASE_*)

npm install
npm run dev
```

Deploy Firestore rules from project root: `firebase deploy --only firestore`.

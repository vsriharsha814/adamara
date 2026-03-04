# AdAmara

Next.js app for ad requests. Uses Firebase (Auth + Firestore). Admin at `/admin/login` (Google sign-in; access must be approved).

## Setup

```bash
cp .env.sample .env
# Edit .env with your Firebase config (NEXT_PUBLIC_FIREBASE_*)

npm install
npm run dev
```

Deploy Firestore rules: `firebase deploy --only firestore`.  
To allow creating admins by setting `makeAdmin: true` on a login request (in the app or in Firestore Console), deploy Cloud Functions: `cd functions && npm install && cd .. && firebase deploy --only functions`.

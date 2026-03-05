# AdAmara

AdAmara is an ad‑request portal for **Amaravati Communications Pvt. Ltd.** It gives individuals and teams one place to submit ad requests (with timelines, budgets, and reference files) and lets approved admins review, track, and export those requests from a simple dashboard.

Use it when you want a **clear, trackable workflow** instead of ad‑hoc emails or chats for getting ads created and approved.

## Setup (local)

```bash
cp .env.sample .env
# Fill NEXT_PUBLIC_FIREBASE_* from your Firebase web app

npm install
npm run dev
```

Deploy Firestore rules (from project root): `firebase deploy --only firestore`.

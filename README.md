# AdAmara - Ad Request Management System

AdAmara is a Next.js application for managing advertising requests, featuring a multi-step form for users to submit requests and an admin dashboard for processing those requests.

The app runs **without a backend server**. The Next.js app in `web/` uses **Firebase** (Auth + Firestore). Admin is at **`/admin`** (login at `/admin/login` with Google); it is **not linked** from the home page. See **docs/ARCHITECTURE.md** for details.

## 🚀 Features

- **Multi-step dynamic form** for submitting ad requests
- **Optional reference image uploads** stored inline on the request
- **Admin dashboard** for managing requests
- **Responsive design** for mobile and desktop
- **Secure authentication** for admin users (Google sign‑in via Firebase Auth)
- **Data export** capabilities (CSV from the admin dashboard)

## 📋 Prerequisites

- Node.js (v18+ recommended)
- A **Firebase** project (Auth + Firestore)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/adamara.git
cd adamara
```

2. **Set up environment variables**

```bash
cp .env.sample .env
```

Edit the `.env` file with your configuration.

3. **Install dependencies**

```bash
npm install
cd web && npm install
```

4. **Start the Next.js app**

```bash
npm run dev
```

## 🗂️ Project Structure

```
adamara/
├── web/                     # Next.js frontend (Vercel-friendly)
│   └── src/
│       └── app/             # App Router routes
├── .gitignore               # Git ignore file
├── README.md                # Project documentation
└── package.json             # Root package.json for scripts
```

## 🚢 Deployment

### Frontend (Next.js on Vercel)

The app lives in `web/` and is designed for Vercel.

1. Create a new Vercel project from this repo (or import it).
2. **Set environment variables** (see `.env.sample`): all `NEXT_PUBLIC_FIREBASE_*` keys from your Firebase project.
3. Deploy.

Notes:
- No backend URL is required; the app talks to Firebase from the browser.
- Deploy Firestore rules: `firebase deploy --only firestore` (after `firebase init` in the repo).

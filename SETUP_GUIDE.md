# AdAmara Setup Guide (Next.js + Firebase)

This guide walks you through setting up and running the **AdAmara** ad request portal using the **Next.js** app and **Firebase** (Auth + Firestore).

There is **no separate backend server** – everything runs from this Next.js app at the project root.

---

## 1. Prerequisites

- Node.js v18+ (recommended)
- npm (comes with Node)
- A Firebase project with:
  - Firebase Authentication (Google sign‑in)
  - Cloud Firestore

---

## 2. Clone the repository

```bash
git clone <repository-url>
cd adamara
```

---

## 3. Create a Firebase project and web app

1. Go to the Firebase console: `https://console.firebase.google.com`
2. **Create a new project** (or select an existing one).
3. In **Project settings → General → Your apps**, click **“Add app” → Web** (</>):
   - Give it a name (e.g. `adamara-web`).
   - Register the app (you do *not* need to enable hosting here).
4. Firebase will show a config snippet:

```js
const firebaseConfig = {
  apiKey: "…",
  authDomain: "…",
  projectId: "…",
  messagingSenderId: "…",
  appId: "…",
};
```

You will map these values into your `.env` file in the next step.

---

## 4. Configure environment variables

From the project root:

```bash
cp .env.sample .env
```

Open `.env` and fill in the **Next.js** Firebase variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

Use the values from the `firebaseConfig` snippet:

- `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
- `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 5. Enable Firebase products

In your Firebase project:

### 5.1 Authentication (Google sign‑in for admin)

1. Go to **Build → Authentication → Get started**.
2. Under the **Sign‑in method** tab:
   - Enable **Google**.
   - Configure the authorized domains if prompted (make sure `localhost` and your production domain are included).

### 5.2 Cloud Firestore

1. Go to **Build → Firestore Database**.
2. Click **Create database**.
3. Choose a region and **Start in production mode** (recommended) or test mode for local development.
4. After creation, you can deploy rules later with the Firebase CLI (see below).

> The app uses Firestore collections to store ad requests; no additional schema setup is required.

### 5.3 Admin access (allowlist)

Admin sign-in is **allowlist-based**: only users you approve can access the admin area.

- **First admin:** There is no admin until you create one. In Firebase Console → **Firestore Database**, create a collection named **`allowed_admins`**. Add a document with **document ID = your Firebase Auth UID** (you can get this by trying to sign in once at `/admin/login`; the “Access pending” screen will show your UID and instructions). You can leave the document empty or add fields like `email` and `displayName`. Save, then sign in again — you will have access.
- **More admins:** After that, any other user who tries to sign in will see “Your request has been submitted…”. As an existing admin, open the **Dashboard**; you will see a **Pending access requests** section. Click **Approve** to allow that user. They can then sign in and see the admin pages.

---

## 6. Install dependencies

From the project root:

```bash
npm install
```

This installs all Next.js app dependencies.

---

## 7. Run the app locally

From the project root:

```bash
npm run dev
```

This runs the Next.js app with hot reload.

- Public site and request form: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

> Admin login uses Firebase Google Auth. Any Google account that successfully signs in will be able to see the admin UI; you can tighten this later with custom claims / allowlists in Firestore rules.

---

## 8. Firestore security rules (recommended)

To properly secure requests, you should deploy Firestore rules that:

- Allow **anyone** to create a new request (for the public form).
- Allow **only authenticated admins** to read/update requests.

A simple pattern is:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /requests/{requestId} {
      allow create: if true;                 // public can submit
      allow read, update, delete: if request.auth != null; // restrict to signed-in users
    }
  }
}
```

> This is an example, not a full rule set. Adjust to your org’s requirements before deploying.

To deploy rules you’ll need the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # choose this repo and your project
firebase deploy --only firestore
```

---

## 9. Image uploads

The current app allows users to upload a **small number of compressed images** as references:

- Images are stored **directly on the request document** in Firestore (as small data URLs with metadata).
- Limits are enforced in the UI (file type, size, and count) to keep documents within Firestore size constraints.

You don’t need to configure Firebase Storage for this version.

---

## 10. Production deployment (Vercel)

The app is designed to be deployed as a standard Next.js app.

1. Push your repo to GitHub / GitLab.
2. In Vercel:
   - Import the repo.
   - Leave **Root Directory** empty (or set to `.`) so the app at the repo root is used.
   - In **Environment Variables**, add:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. Deploy.

> After deployment, visit `[your-domain]/admin/login` to access the admin area with Google sign‑in.

---

## 11. Quick recap

- **Code you run:** the Next.js app at the project root.
- **State:** stored in Firestore (`requests` collection) with optional inline image data.
- **Auth:** handled by Firebase Authentication (Google provider).
- **Local dev:** `npm run dev` (after `.env` and Firebase project setup).
- **Prod:** Deploy the repo as a Next.js app (Vercel recommended) and configure the same Firebase env vars.


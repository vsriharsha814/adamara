# AdAmara architecture

## Overview

- **One app**: The Next.js app in `web/` is the only app you need to run. It serves the public site and the admin area.
- **No backend server**: There is no Express (or other) API server in normal use. Auth and data are handled by **Firebase** (Auth + Firestore).
- **Admin is separate from the home page**: The admin area lives at `/admin/*`. It is **not linked** from the home page. Only people who know the URL (e.g. `/admin/login`) and sign in with Google can access it.

## Flow

1. **Public**
   - Home: `/` — marketing and “Start an Ad Request”.
   - Request form: `/request` — submits directly to **Firestore**. No server in the middle.

2. **Admin**
   - Login: `/admin/login` — **Google sign-in** via Firebase Auth. Not linked from the home page.
   - Dashboard: `/admin/dashboard` — lists requests from **Firestore** (client-side).
   - Request detail: `/admin/requests/[id]` — get/update a request in **Firestore** (client-side).
   - CSV export: built in the browser from Firestore data.

3. **Security**
   - **Firestore rules**: Anyone can **create** a request (public form). Only **signed-in** users can read/update/delete requests (admin).

## Repo layout

- **`web/`** — Next.js app (public site + admin). This is the only app.
- **`firestore.rules`** — Deploy with Firebase CLI (`firebase deploy --only firestore`).

## Env vars

- **Web**: `NEXT_PUBLIC_FIREBASE_*` (API key, auth domain, project ID, storage bucket, messaging sender ID, app ID). See `.env.sample`.

No server env vars are required for the client-only setup.

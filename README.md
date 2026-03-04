# AdAmara - Ad Request Management System

AdAmara is a Next.js application for managing advertising requests, featuring a multi-step form for users to submit requests and an admin dashboard for processing those requests.

The app runs **without a backend server**. The Next.js app in `web/` uses **Firebase** (Auth + Firestore). Admin is at **`/admin`** (login at `/admin/login` with Google); it is **not linked** from the home page. See **docs/ARCHITECTURE.md** for details.

## 🚀 Features

- **Multi-step dynamic form** for submitting ad requests
- **File upload** support for PDFs and images
- **Admin dashboard** for managing requests
- **Email notifications** for request status updates
- **Responsive design** for mobile and desktop
- **Secure authentication** for admin users
- **Data export** capabilities

## 📋 Prerequisites

- Node.js (v16+)
- A **Firebase** project (Auth, Firestore, Storage)
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
- Deploy Firestore and Storage rules: `firebase deploy --only firestore` and `firebase deploy --only storage` (after `firebase init` in the repo).

The legacy `client/` (CRA) and `server/` (Express) apps have been removed; the project is now a single Next.js app in `web/`.

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register a new admin (restricted)
- `GET /api/auth/current` - Get current user info

### Request Endpoints

- `POST /api/requests` - Create a new request
- `GET /api/requests` - Get all requests (with filtering)
- `GET /api/requests/:id` - Get a single request by ID
- `PUT /api/requests/:id` - Update a request
- `GET /api/requests/export/csv` - Export requests as CSV

## 🔒 Security Considerations

- All routes requiring authentication are protected with JWT
- Input validation is implemented on all endpoints
- Rate limiting is applied to prevent abuse
- File uploads are restricted by type and size

## 🧪 Testing

Run tests:
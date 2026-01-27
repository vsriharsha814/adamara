# AdAmara - Ad Request Management System

AdAmara is a full-stack application for managing advertising requests, featuring a multi-step form for users to submit requests and an admin dashboard for processing those requests.

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
- MongoDB (local or Atlas)
- npm or yarn
- AWS S3 bucket (for production)

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
npm run install:all
```

4. **Start development servers**

```bash
npm run start
```

This will start both the client (React) and server (Node.js) concurrently.

## 🗂️ Project Structure

```
adamara/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   └── src/                 # Source files
├── web/                     # New Next.js frontend (Vercel-friendly)
│   └── src/
│       └── app/             # App Router routes
├── server/                  # Backend Node.js application
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── .gitignore               # Git ignore file
├── README.md                # Project documentation
└── package.json             # Root package.json for scripts
```

## 🚢 Deployment

### Frontend (Next.js on Vercel)

The upgraded UI lives in `web/` and is designed for Vercel.

1. Create a new Vercel project from this repo (or import it)
2. **Set environment variable**:
   - `NEXT_PUBLIC_API_BASE_URL` = your backend URL (example: `https://your-backend.example.com`)
3. Deploy

Notes:
- The Next.js app calls your backend at `${NEXT_PUBLIC_API_BASE_URL}/api/...`
- A root `vercel.json` is included so Vercel builds the `web/` app automatically.

### Backend Deployment

1. Set up a MongoDB Atlas cluster
2. Configure AWS S3 for file storage
3. Deploy to Heroku, Render, or your preferred hosting:

```bash
heroku create
git push heroku main
```

### Legacy Frontend (CRA)

The original React app is still in `client/` (kept for reference during migration). Going forward, use `web/`.

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
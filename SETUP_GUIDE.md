# AdAmara Setup Guide

This document provides step-by-step instructions to set up and run the AdAmara application - an ad request management system featuring a multi-step form for ad submissions and an admin dashboard for processing requests.

## Prerequisites

- Node.js v16 or higher
- npm or yarn
- Git (to clone the repository)
- Internet connection (for downloading dependencies and accessing MongoDB Atlas)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd adamara
```

## Step 2: Set Up MongoDB Atlas (Cloud Database)

1. **Create a MongoDB Atlas account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and register for a free account
   - Sign in to your account

2. **Create a free cluster**:
   - Click "Build a Database"
   - Select "FREE" shared cluster option
   - Choose your preferred cloud provider (AWS, Google Cloud, or Azure) and region
   - Click "Create Cluster" (this may take a few minutes to provision)

3. **Set up database access**:
   - In the left sidebar, click "Database Access" under SECURITY
   - Click "Add New Database User"
   - Create a username and password (store these securely, you'll need them later)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure network access**:
   - In the left sidebar, click "Network Access" under SECURITY
   - Click "Add IP Address"
   - For development purposes, you can add your current IP or select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get your connection string**:
   - Go back to Database deployments (click "Database" in the left sidebar)
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string (it will look like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with `adamara`

## Step 3: Configure Environment Variables

1. **Create a .env file in the root directory**:

```bash
cp .env.sample .env
```

2. **Edit the .env file with your specific settings**:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:your-password@cluster0.xxxxx.mongodb.net/adamara?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=choose-a-strong-secret-key-here
JWT_EXPIRE=1d

# Email Configuration (optional for development)
# EMAIL_HOST=smtp.example.com
# EMAIL_PORT=587
# EMAIL_SECURE=false
# EMAIL_USER=your_email_username
# EMAIL_PASSWORD=your_email_password
# EMAIL_FROM=noreply@adamara.example.com

# File Upload (using local storage for development)
# No need to configure AWS/cloud storage for development
```

## Step 4: Create Upload Directory

Create a directory for file uploads in the server folder:

```bash
mkdir -p server/uploads
```

## Step 5: Install Dependencies

Install all dependencies for both server and client:

```bash
npm run install:all
```

If the above command fails, you can install dependencies separately:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

## Step 6: Start the Application

Start both the client and server concurrently:

```bash
npm start
```

This will start:
- The React frontend at http://localhost:3000
- The Node.js backend at http://localhost:5000

## Step 7: Create an Admin User

To access the admin dashboard, you need to create an admin user. You can do this using a tool like [Postman](https://www.postman.com/downloads/) or cURL:

Using cURL:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"your-secure-password","role":"admin"}'
```

Using Postman:
1. Create a new POST request to `http://localhost:5000/api/auth/register`
2. Set Content-Type header to `application/json`
3. Set request body to:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "your-secure-password",
  "role": "admin"
}
```
4. Send the request

This will return a JWT token, but you don't need to save it since you'll login through the UI.

## Step 8: Access the Application

1. **Access the public form**:
   - Open your browser and go to: http://localhost:3000/request
   - This is where users can submit ad requests

2. **Access the admin dashboard**:
   - Go to: http://localhost:3000/admin/login
   - Login with the admin email and password you created in Step 7
   - Once logged in, you can view and manage ad requests

## Troubleshooting

### Connection to MongoDB fails

- Verify your MongoDB Atlas connection string in the .env file
- Check if your IP address is allowed in the Network Access settings in MongoDB Atlas
- Ensure you've replaced `<password>` with your actual database user password

### File uploads don't work

- Ensure the `server/uploads` directory exists and is writable
- For large files, check if they exceed the 10MB limit defined in the application

### Port conflicts

- If port 3000 or 5000 is already in use, you can modify the ports:
  - For the client: Edit `PORT=3001` in `client/.env`
  - For the server: Edit `PORT=5001` in the root `.env` file

### Admin registration fails

- Ensure your MongoDB connection is working
- Check the server logs for specific error messages
- Verify that you're including all required fields in the registration request

## Production Deployment Considerations

For development purposes, the setup above is sufficient. When you're ready to deploy to production:

1. **Set NODE_ENV to production** in your .env file
2. **Configure proper email settings** for notifications
3. **Set up secure JWT secret keys**
4. **Consider setting up cloud storage** (AWS S3 or Google Cloud Storage) for file uploads
5. **Deploy the frontend** to a service like Vercel or Netlify
6. **Deploy the backend** to a service like Render, Railway, or a VPS

## Additional Information

- The client runs on React (port 3000 by default)
- The server runs on Node.js/Express (port 5000 by default)
- Files are stored locally in development mode in the `server/uploads` directory
- MongoDB Atlas free tier is sufficient for development and small-scale production use

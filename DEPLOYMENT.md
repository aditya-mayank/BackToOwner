# BackToOwner Deployment Configuration & Checklist

Follow these exact steps to ensure the BackToOwner infrastructure is systematically securely deployed.

## 1. MongoDB Atlas Setup
- [ ] Create a MongoDB cluster on MongoDB Atlas.
- [ ] Navigate to Network Access and whitelist `0.0.0.0/0` (Allows Render dynamic IPs).
- [ ] Get the connection string (URI) and replace `<password>` with your database user's password.

## 2. Cloudinary Setup
- [ ] Log into the Cloudinary Dashboard.
- [ ] Copy the Cloud Name, API Key, and API Secret.

## 3. Backend Deployment (Render)
- [ ] Create a new Web Service on Render and connect your GitHub repository.
- [ ] Render will automatically read `render.yaml` if it is in the root directory.
- [ ] If setting up manually:
  - **Build Command**: `cd backend && npm install`
  - **Start Command**: `node server.js`
- [ ] Set all required Environment Variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
- [ ] Deploy the API! Wait for the build to pass.

## 4. Frontend Deployment (Vercel)
- [ ] Create a new project on Vercel and link your GitHub repository.
- [ ] Make sure the Framework Preset is set correctly (Vite).
- [ ] Set the environment variable `VITE_API_URL` to match the exact URL given by Render (e.g. `https://backtoowner-api.onrender.com/api`).
- [ ] Deploy the frontend!

## 5. Verification
- [ ] Ensure the backend is globally accessible by pinging: `GET https://backtoowner-api.onrender.com/api/health`
- [ ] The JSON response should reliably return: `{ status: 'ok', db: 'connected', ... }`.

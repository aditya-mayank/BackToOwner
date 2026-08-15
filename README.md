# BackToOwner

![BackToOwner](https://img.shields.io/badge/Status-Active-brightgreen)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)

**BackToOwner** is a smart, full-stack Lost & Found system built for campus environments. It bridges the gap between students who have lost their belongings and those who have found them, utilizing an advanced NLP-based matching engine to proactively suggest matches.

## 🌟 Key Features

- **Custom NLP Matching Engine:** Uses the Overlap Coefficient to calculate the similarity between lost and found item descriptions, automatically suggesting high-probability matches to users.
- **Role-Based Access Control (RBAC):** Distinct roles for Students and Administrators. Admins are equipped to securely verify claims and oversee the item lifecycle.
- **Secure Image Pipeline:** Integrated with Cloudinary for seamless image uploads. Users can upload images of items which are streamed directly to Cloudinary without taking up local server disk space.
- **Real-time Claim Verification:** Users can submit proof of ownership for found items, which is processed securely through an admin dashboard.
- **Proactive Notifications:** When a potential match is found by the engine, users are proactively alerted.

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite for fast build times
- **Tailwind CSS** for responsive, modern UI design
- **Axios** for API communication

### Backend
- **Node.js & Express.js** for RESTful API architecture
- **MongoDB & Mongoose** for scalable data storage
- **Cloudinary & Multer** for image buffering and secure cloud storage
- **JWT** for stateless, secure user authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB connection URI
- Cloudinary Account credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aditya-mayank/BackToOwner.git
   cd BackToOwner
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd src
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `backend` directory based on the `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Run the Application:**
   Start the backend and frontend concurrently or in separate terminals.
   ```bash
   # Terminal 1 (Backend)
   cd backend
   npm start

   # Terminal 2 (Frontend)
   npm run dev
   ```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

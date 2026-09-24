# BackToOwner

![BackToOwner](https://img.shields.io/badge/Status-Active-brightgreen)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![NLP Matcher](https://img.shields.io/badge/MatchingEngine-Natural%20NLP-orange)

**BackToOwner** is a smart, full-stack Lost & Found system tailored for campus and community environments. Moving beyond traditional "bulletin board" style applications, BackToOwner features an intelligent, automated matching engine that proactively links users who have lost items with those who have found them, utilizing Natural Language Processing (NLP) and perceptual image hashing.

---

## 🔄 Complete System Workflows

### 1. The "Lost Item" Workflow (Victim)
When a user loses an item, the system guides them through a streamlined process designed to maximize recovery chances without compromising privacy.
1. **Reporting:** The user fills out a detailed form (Title, Category, Location, Date, Description, and an optional Image). They can choose to make this listing **Public** (visible on the community feed) or **Private** (hidden from the feed, relying entirely on the NLP matching engine).
2. **Analysis & Storage:** The backend processes the text (stemming, tokenizing) and calculates a perceptual image hash if an image is provided. The item is saved with `type: 'lost'`.
3. **Instant Matching:** The NLP engine immediately scans all active `found` items in the database.
4. **Notification:** If a match threshold is met, the system proactively generates a notification to *both* the victim and the finder.
5. **Secure Connection:** A dedicated, secure chat channel is instantiated between the two users, allowing them to communicate and verify ownership safely.

### 2. The "Found Item" Workflow (Finder)
To prevent malicious actors from browsing a public feed of found items and making false claims, the found workflow is highly restricted and privacy-first.
1. **Reporting:** The finder submits details of the item they discovered.
2. **Private by Default:** The backend *hardcodes* the visibility of all found items to **Private**. They will **never** appear on a public feed.
3. **Reverse Matching:** The NLP engine scans all active `lost` items. If a match is found, the system securely alerts both parties and opens a chat.
4. **Verification via Chat:** The finder acts as the verifying authority, asking the potential owner identifying questions (e.g., "What is the background image on the phone?" or "What is in the front pocket of the bag?") via the secure chat.
5. **Resolution:** Once ownership is verified and the item is physically returned, the chat can be closed, and the item status is marked as `resolved`.

### 3. The "Admin" Workflow (Moderation & Oversight)
Administrators (e.g., campus security, student council) are equipped with a powerful `AdminDashboard` to oversee the health and safety of the platform.
1. **Global Item Management:** Admins can view *all* items, regardless of visibility (public/private/found/lost). They can archive items or permanently delete fraudulent listings.
2. **User Moderation:** Admins have access to the complete user registry. They can actively monitor account statuses and instantly **block** malicious users. Blocking a user immediately closes all of their active secure chats to prevent further communication.
3. **Automated Archival:** Admins can manually trigger the background archival job, which automatically sweeps and archives old, stale items to keep the matching engine performant.
4. **System Analytics:** Admins have access to a live statistics panel tracking the real-time count of lost items, found items, active chats, active users, and successful resolutions.

---

## 🏗️ Deep Architectural Overview

### 1. Custom NLP & Perceptual Image Matching Engine
The core of BackToOwner is its highly specialized `matchingEngine` (`backend/utils/matchingEngine.js`).
- **Text-Based Scoring:** Utilizing the `natural` NLP library, the engine applies the **PorterStemmer** to tokenize and stem strings, removing stop words and punctuation. It calculates an overlap score and utilizes **Jaro-Winkler distance** to forgive typos and fuzzy spatial matches (e.g., "Library" ≈ "Central Library").
- **Perceptual Image Hashing:** Images uploaded to Cloudinary are fetched as array buffers and passed through an `imghash` algorithm. This generates a 64-bit Hex hash, which is stored in the database. The system calculates the **Hamming Distance** between two hashes to determine visual similarity, entirely bypassing slow pixel-by-pixel comparisons.
- **Dynamic Thresholding:** The matching engine intelligently weights signals. If both items possess images, the image score dominates the calculation (up to 40% of the total score), and the overall match threshold dynamically lowers to favor the strong visual signal.

### 2. Database Schema & Indexing (MongoDB)
- **Compound & Text Indices:** The `Item` model utilizes compound indices on `[type, status, category]` for highly efficient filtering. Furthermore, it employs a MongoDB Text Index on `[title, description]` to enable rapid full-text search querying.
- **Relational References:** The schema heavily relies on Mongoose `ObjectId` references to link `Users`, `Items`, and `Chats`, ensuring relational data integrity within a NoSQL structure.

### 3. Secure Real-time Internal Chat Architecture
The `Chat.model.js` structure maintains strict privacy. A chat document requires references to the specific `lostItem`, `foundItem`, and an array of exactly two `participants`. If an admin blocks a user, a cascaded update is triggered to close all associated active chats.

### 4. Proactive Notification System
Instead of forcing users to constantly check the platform, the backend `notification.controller.js` triggers internal alerts for:
- "Potential Match!" alerts generated by the NLP engine.
- System updates on the status of reported items.

---

## 🛠️ System Architecture & Tech Stack

### Frontend (React + Vite)
- **Framework:** React 18 with Vite for lightning-fast HMR and optimized builds.
- **Styling:** Tailwind CSS for a highly responsive, modern, utility-first design.
- **State & Routing:** `react-router-dom` for client-side routing, protected by `ProtectedRoute` and `AuthLayout` wrappers.
- **HTTP Client:** Axios for robust API communication.
- **Animations:** Framer Motion for sleek UI transitions.

### Backend (Node.js + Express)
- **Runtime:** Node.js powered by Express.js.
- **Database:** MongoDB configured with Mongoose.
- **Authentication:** Stateless JWT (JSON Web Tokens) architecture.
- **Media Handling:** Cloudinary paired with Multer for seamless, serverless image buffering and secure cloud storage.
- **NLP Toolkit:** `natural` library for stemming and Jaro-Winkler calculations.

---

## 🗂️ Project Structure

The monolithic repository is divided into two main environments:

### `/backend`
- **`/controllers`**: Core business logic (`item.controller.js`, `auth.controller.js`, `chat.controller.js`, `admin.controller.js`, etc.)
- **`/models`**: Mongoose schemas (`User.model.js`, `Item.model.js`, `Chat.model.js`, `Notification.model.js`).
- **`/routes`**: Express routers securely mapping to controllers.
- **`/utils`**: Home to the `matchingEngine.js` which houses the `evaluateItemMatch` algorithm and archival job scripts.

### `/src` (Frontend)
- **`/pages`**: Full-page views (`Dashboard.jsx`, `AdminDashboard.jsx`, `ReportLost.jsx`, `ReportFound.jsx`, `SecureChat.jsx`, etc.)
- **`/components`**: Reusable UI blocks (`Navbar.jsx`, `Hero.jsx`, `StatsBar.jsx`, `HowItWorks.jsx`, `Skeleton.jsx`).
- **`/context`**: React Context providers for global state management.

---

## 📡 API Endpoint Reference (Overview)

BackToOwner exposes a secure RESTful API. Below are the core domains:

- **Auth Routes (`/api/auth`)**: Registration, Login, Profile Management.
- **Item Routes (`/api/items`)**:
  - `POST /report/lost` - Submit a lost item.
  - `POST /report/found` - Submit a found item (triggers match engine).
  - `GET /search` - Query items using full-text search, filters, and RBAC visibility rules.
  - `PUT /:id` - Edit textual details of a user's own item.
- **Chat Routes (`/api/chat`)**: Fetch active conversations, send messages securely.
- **Notification Routes (`/api/notifications`)**: Retrieve and mark system alerts as read.
- **Admin Routes (`/api/admin`)**: Elevated endpoints for system oversight, global item modification, user blocking, and stats gathering.

---

## 🚀 Development Guide

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas cluster (or local instance)
- Cloudinary Account (for image hosting)

### 1. Installation
Clone the repository and install dependencies for both sides of the stack:
```bash
git clone https://github.com/aditya-mayank/BackToOwner.git
cd BackToOwner

# Install Backend
cd backend
npm install

# Install Frontend
cd ../src
npm install
```

### 2. Environment Configuration
Navigate to the `backend` directory and create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_highly_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Running the Application Locally

You will need to run the frontend and backend servers concurrently. 

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```
*The backend will initialize and connect to MongoDB.*

**Terminal 2 (Frontend):**
```bash
cd src
npm run dev
```
*Vite will launch the development server (typically at `http://localhost:5173`).*

---

## 🤝 Contributing & License
Contributions, issues, and feature requests are highly encouraged. Please feel free to open a Pull Request or an Issue detailing your proposed changes to the matching engine, UI, or backend architecture.

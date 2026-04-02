import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Validate env vars immediately
import { validateEnv } from './utils/validateEnv.js';
validateEnv();

// Import Utilities
import { globalLimiter } from './middleware/rateLimit.middleware.js';
import { startArchivalJob } from './utils/archivalJob.js';
import { connectDB } from './config/db.js';

// Import Route modules
import authRoutes from './routes/auth.routes.js';
import itemRoutes from './routes/item.routes.js';
import claimRoutes from './routes/claim.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import bcrypt from 'bcryptjs';
import User from './models/User.model.js';

// Connect to Database
await connectDB();

const app = express();

// Set trust proxy to trust Render/Heroku reverse proxy
app.set('trust proxy', 1);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CORS_ORIGIN
].filter(Boolean);

// Middleware
app.use(globalLimiter); // Apply rate limiting globally
app.use(helmet()); // Basic security headers
app.use(cors({ origin: allowedOrigins })); // Allow specified domains
app.use(express.json()); // Parse JSON bodies

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Detailed logging in production
} else {
  app.use(morgan('dev')); // Concise request logging in dev
}

// Basic route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'BackToOwner API is running', 
    version: '1.0.0', 
    env: process.env.NODE_ENV 
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: 'error', db: 'disconnected' });
  }
  return res.status(200).json({
    status: 'ok',
    db: 'connected',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Catch-all 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;

// Admin Auto-Seeder Utility
const seedAdmin = async () => {
  try {
    const email = 'admin123@nitw.ac.in';
    const adminUser = await User.findOne({ email });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    if (!adminUser) {
      console.log('[Seeder] No admin found. Generating master credentials...');
      await new User({
        name: 'Master Admin',
        email,
        passwordHash: hashedPassword,
        role: 'admin',
        accountStatus: 'active'
      }).save();
      console.log('[Seeder] Master Admin created successfully.');
    } else {
      console.log('[Seeder] Admin found. Ensuring correct role & active status...');
      adminUser.role = 'admin';
      adminUser.accountStatus = 'active';
      // Only reset password if it's a dev reset request (optional)
      // adminUser.passwordHash = hashedPassword; 
      await adminUser.save();
    }
  } catch (error) {
    console.error('[Seeder ERROR] Failed to initialize admin:', error.message);
  }
};

const server = app.listen(PORT, async () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  await seedAdmin(); // Securely initializes master accounts instantly
  
  // Start background jobs
  startArchivalJob();
});

// Graceful Shutdown Support
const shutdown = async (signal) => {
  console.log(`\n[${signal}] signal received. Commencing graceful shutdown...`);
  
  // 1. Close HTTP server
  server.close(async () => {
    console.log('[Server] HTTP server closed. No longer accepting new connections.');
    
    try {
      // 2. Disconnect DB
      await mongoose.disconnect();
      console.log('[DB] Mongoose disconnected safely.');
      
      // 3. Process exit
      process.exit(0);
    } catch (err) {
      console.error('[Shutdown Error]', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

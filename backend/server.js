import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
import User from './models/User.model.js';

// Connect to Database
await connectDB();

const app = express();

// Set trust proxy to trust Render/Heroku reverse proxy
app.set('trust proxy', 1);

// CORS Configuration MUST BE FIRST
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true
}));

// Middlewares
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Global Limiter - Move AFTER CORS so errors have CORS headers
app.use(globalLimiter); 

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'BackToOwner API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Admin Auto-Seeder Utility
const seedAdmin = async () => {
  try {
    const email = 'admin123@nitw.ac.in';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    let adminUser = await User.findOne({ email: email.toLowerCase() });
    if (!adminUser) {
      console.log('[Seeder] No admin found. Generating master account...');
      adminUser = new User({
        name: 'Master Admin', email: email.toLowerCase(),
        passwordHash: hashedPassword, role: 'admin', accountStatus: 'active'
      });
      await adminUser.save();
    } else {
      console.log('[Seeder] Syncing Master Admin privileges...');
      await User.updateOne({ _id: adminUser._id }, { $set: { role: 'admin', accountStatus: 'active' } });
    }
  } catch (error) { console.error('[Seeder ERROR]:', error.message); }
};

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log(`[Server] Running on port ${PORT}`);
  await seedAdmin();
  startArchivalJob();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Graceful Shutdown
const shutdown = async (sig) => {
  console.log(`\n[${sig}] received. Shutting down...`);
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    // Detect empty or placeholder Atlas domains and boot RAM server natively instead!
    if (!mongoUri || mongoUri.includes('cluster0.abcde.mongodb.net')) {
      console.log('[DB] Placeholder or missing MONGO_URI detected. Booting ephemeral Memory Server internally...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      process.env.MONGO_URI = mongoUri; 
    }

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    console.log(`[DB] MongoDB Memory or External Array connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export { connectDB, mongoose };

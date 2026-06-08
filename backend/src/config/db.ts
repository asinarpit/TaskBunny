import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async (): Promise<void> => {
  try {
    //important
    dns.setServers(['1.1.1.1', '8.8.8.8']);

    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};


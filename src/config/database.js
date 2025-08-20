import mongoose from 'mongoose';
import { config } from '../../config.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI).then(() => {
      console.log('MongoDB connected successfully')
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
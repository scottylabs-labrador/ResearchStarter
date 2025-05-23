import mongoose from 'mongoose';

const MONGO_URI = process.env.ATLAS_URI!;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGO_URI);
};
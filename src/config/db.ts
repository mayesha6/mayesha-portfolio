import mongoose from 'mongoose';

export const connectDB = async () => {
  const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;
  if (!dbUrl) {
    throw new Error('Database URL is not defined in environment variables');
  }

  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }

  await mongoose.connect(dbUrl);
};

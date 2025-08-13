import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectFromDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

// ✅ פונקציה שמוחקת את כל האינדקסים בקולקציה users
export const dropUserIndexes = async () => {
  try {
    const result = await (mongoose.connection.db as any).collection('users').dropIndexes();
  
    console.log('Dropped indexes:', result);
  } catch (error) {
    console.error('Error dropping indexes:', error);
  }
};

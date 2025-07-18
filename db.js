// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToMongo = async () => {
  try {
    const mongoUri = process.env.MONGOODB_URL;
    if (!mongoUri) throw new Error('MONGO_URI is undefined');
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
};

export default connectToMongo;
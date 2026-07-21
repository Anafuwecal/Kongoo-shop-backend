import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.LIVE_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error(`Database connection failed:`, error);
    }
}

export default connectDB
// Quick test script to verify MongoDB connection
import mongoose from "mongoose";
import 'dotenv/config';

const testConnection = async () => {
    try {
        console.log('Testing MongoDB connection...');
        console.log('Connection string:', process.env.MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide password in logs
        
        const dbName = process.env.DB_NAME || 'prescripto';
        await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
        console.log('✅ MongoDB connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

testConnection();


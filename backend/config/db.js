import mongoose from 'mongoose';

const connectDB = async () => {
    // Strict Check: Agar MONGO_URI setup hi nahi hai .env mein, toh crash kar do
    if (!process.env.MONGO_URI) {
        console.error('❌ CRITICAL ERROR: MONGO_URI is missing in .env file!');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`📡 MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Connection Failed: ${error.message}`);
        // Production Rule: Agar DB connect nahi hua, toh server chalu rakhne ka koi fayda nahi
        process.exit(1); 
    }
};

export default connectDB;
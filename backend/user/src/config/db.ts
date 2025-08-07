import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectToDatabase = async () => {
    const DATABASE_URL = process.env.DATABSE_URI;
    if(!DATABASE_URL) {
        throw new Error("Database Url not provided")
    }

    try {
        await mongoose.connect(DATABASE_URL);
    } catch(error: any) {
        throw new Error(error.name)
    }
}

export default connectToDatabase;
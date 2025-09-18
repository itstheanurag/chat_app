import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectToDatabase = async () => {
  const DATABASE_URL = process.env.DATABASE_URI;
  if (!DATABASE_URL) {
    throw new Error("Database Url not provided");
  }

  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to the database");
  } catch (error: unknown) {
    console.log(error);
    throw new Error(error.name);
  }
};

export default connectToDatabase;

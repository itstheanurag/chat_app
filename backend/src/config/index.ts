import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
  const DATABASE_URL = process.env.DATABASE_URI;
  if (!DATABASE_URL) {
    throw new Error("❌ Database URL not provided");
  }

  try {
    await mongoose.connect(DATABASE_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err: unknown) {
    handleDatabaseConntectionError(err);
    process.exit(1);
  }
};

export default connectToDatabase;

function handleDatabaseConntectionError(err: unknown) {
  console.log("SOMETHING WENT WRONG WITH DATABASE");
  if (err instanceof mongoose.Error.MongooseServerSelectionError) {
    console.error("🚨 Cannot connect to MongoDB: Server selection failed");
  } else if (err instanceof mongoose.Error) {
    console.error("🚨 General Mongoose error:", err.message);
  } else if (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as { name: string }).name === "MongoParseError"
  ) {
    console.error("🚨 Invalid MongoDB connection string");
  } else if (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as { name: string }).name === "MongoNetworkError"
  ) {
    console.error("🚨 Network error connecting to MongoDB");
  } else {
    console.error("🚨 Unknown error while connecting to MongoDB:", err);
  }
}

import mongoose from "mongoose";
import config from "./config";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error(
      "MongoDB connection error. Please ensure your MONGO_URI is set in .env and MongoDB is running.",
      error
    );
    process.exit(1);
  }
};

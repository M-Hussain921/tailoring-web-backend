import mongoose from "mongoose";
import dotenv from "dotenv";
import { env } from "./env.js";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

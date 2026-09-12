import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { env } from "../src/config/env.js";

import User from "../src/models/user.js";

const seedDeveloper = async (): Promise<void> => {
  try {
    const mongoURI = env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(mongoURI);

    const existingDeveloper = await User.findOne({
      role: "developer",
    });

    if (existingDeveloper) {
      console.log("Developer already exists.");
      return;
    }

    const password = env.DEVELOPER_PASSWORD;

    if (!password) {
      throw new Error("DEVELOPER_PASSWORD is not defined");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const email = env.DEVELOPER_EMAIL;
    const phoneNumber = env.DEVELOPER_PHONE;

    if (!email) {
      throw new Error("DEVELOPER_EMAIL is not defined");
    }

    if (!phoneNumber) {
      throw new Error("DEVELOPER_PHONE is not defined");
    }

    if (!password) {
      throw new Error("DEVELOPER_PASSWORD is not defined");
    }

    await User.create({
      username: "developer",
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
      role: "developer",
    });

    console.log("Developer created successfully.");
  } catch (error) {
    console.error("Developer seed failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedDeveloper();

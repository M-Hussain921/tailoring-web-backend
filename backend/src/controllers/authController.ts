import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { MongoServerError } from "mongodb";
import type { RegisterInput, LoginInput } from "../validator/authValidator.js";

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
): Promise<void> => {
  const { username, email, phoneNumber, password } = req.body;

  try {
    let existingUser = await User.findOne({
      $or: [
        { username: username },
        { email: email },
        { phoneNumber: phoneNumber },
      ],
    });
    if (existingUser) {
      res.status(400).json({
        message:
          "User with this username, email or phone number already exists",
      });
      return;
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    let token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env["JWT_SECRET"] as string,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      console.error("Duplicate role:", error["keyValue"]);

      res.status(409).json({
        message: "This role is already assigned to another user",
      });

      return;
    }

    console.error("Unexpected registration error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
): Promise<void> => {
  const { identifier, password } = req.body;
  try {
    let user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }, { username: identifier }],
    });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env["JWT_SECRET"] as string,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

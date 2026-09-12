import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { LoginInput } from "../validator/authValidator.js";
import { env } from "../config/env.js";

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { identifier, password } = req.body;
  try {
    let user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
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

    const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

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
  } catch (error) {
    next(error);
  }
};

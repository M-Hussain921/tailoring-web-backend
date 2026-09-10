import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No Token Provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      message: "No Token Provided",
    });

    return;
  }

  try {
    const secret = process.env["JWT_SECRET"] as string;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const decoded = jwt.verify(token, secret) as {
      id: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

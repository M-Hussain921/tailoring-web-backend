import type { Request, Response, NextFunction } from "express";
import { MongoServerError } from "mongodb";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(error);

  if (error instanceof MongoServerError && error.code === 11000) {
    res.status(409).json({
      success: false,
      message: "Duplicate value already exists",
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

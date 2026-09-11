import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MongoServerError } from "mongodb";
import mongoose from "mongoose";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(error);

  if (error instanceof ZodError) {
    const errors = error.issues.reduce(
      (acc, issue) => {
        const field = issue.path.join(".");

        acc[field] = issue.message;

        return acc;
      },
      {} as Record<string, string>,
    );

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });

    return;
  }

  if (error instanceof MongoServerError && error.code === 11000) {
    const fields = Object.keys(error['keyPattern'] ?? {});

    res.status(409).json({
      success: false,
      message: `Duplicate value for: ${fields.join(", ")}`,
    });

    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string> = {};

    for (const field in error.errors) {
      errors[field] = error.errors[field]?.message ?? "Invalid value";
    }

    res.status(400).json({
      success: false,
      message: "Database validation failed",
      errors,
    });

    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid ${error.path}`,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Review from "../models/review.js";
import type {
  CreateReviewInput,
  ReviewIdInput,
} from "../validator/reviewValidator.js";

export const createReview = async (
  req: Request<{}, {}, CreateReviewInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { customerName, rating, comment } = req.body;

  try {
    const review = new Review({
      customerName,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const approveReview = async (
  req: Request<ReviewIdInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review not found",
      });
      return;
    }

    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (review.status !== "pending") {
      res.status(400).json({
        success: false,
        message: `Cannot approve a ${review.status} review`,
      });
      return;
    }

    review.status = "approved";
    review.approvedAt = new Date();
    review.approvedBy = new mongoose.Types.ObjectId(req.user?.id);

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review approved successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectReview = async (
  req: Request<ReviewIdInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review not found",
      });
      return;
    }

    if (review.status !== "pending") {
      res.status(400).json({
        success: false,
        message: `Review is already ${review.status}`,
      });
      return;
    }

    review.status = "rejected";
    review.approvedAt = null;
    review.approvedBy = null;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review rejected successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reviews = await Review.find()
      .populate("approvedBy", "username role")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (
  req: Request<ReviewIdInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id).populate(
      "approvedBy",
      "username email role",
    );

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllApprovedReviews = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reviews = await Review.find({
      status: "approved",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPendingReviews = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reviews = await Review.find({
      status: "pending",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

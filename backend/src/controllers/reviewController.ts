import type { Request, Response } from "express";
import mongoose from "mongoose";
import Review from "../models/review.js";
import type {
  CreateReviewInput,
  ReviewIdInput,
} from "../validator/reviewValidator.js";

export const createReview = async (
  req: Request<{}, {}, CreateReviewInput>,
  res: Response,
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
  } catch (error: unknown) {
    console.error("Error creating review:", error);

    res.status(500).json({
      success: false,
      message: "Error creating review",
    });
  }
};

export const approveReview = async (
  req: Request<ReviewIdInput>,
  res: Response,
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
  } catch (error: unknown) {
    console.error("Error approving review:", error);

    res.status(500).json({
      success: false,
      message: "Error approving review",
    });
  }
};

export const rejectReview = async (
  req: Request<ReviewIdInput>,
  res: Response,
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
  } catch (error: unknown) {
    console.error("Error rejecting review:", error);

    res.status(500).json({
      success: false,
      message: "Error rejecting review",
    });
  }
};

export const getAllReviews = async (
  req: Request,
  res: Response,
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
  } catch (error: unknown) {
    console.error("Error fetching reviews:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    });
  }
};

export const getReviewById = async (
  req: Request<ReviewIdInput>,
  res: Response,
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
  } catch (error: unknown) {
    console.error("Error fetching review:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching review",
    });
  }
};

export const getAllApprovedReviews = async (
  req: Request,
  res: Response,
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
  } catch (error: unknown) {
    console.error("Error fetching approved reviews:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching approved reviews",
    });
  }
};

export const getAllPendingReviews = async (
  req: Request,
  res: Response,
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
  } catch (error: unknown) {
    console.error("Error fetching pending reviews:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching pending reviews",
    });
  }
};

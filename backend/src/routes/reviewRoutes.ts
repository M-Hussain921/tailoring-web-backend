import express from "express";

import {
  createReview,
  approveReview,
  rejectReview,
  getAllReviews,
  getReviewById,
  getAllApprovedReviews,
  getAllPendingReviews
} from "../controllers/reviewController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

import { validateRequest } from "../middleware/validateMiddleware.js";
import { validateParams } from "../middleware/validateMiddleware.js";

import {
  createReviewSchema,
  reviewIdSchema,
} from "../validator/reviewValidator.js";

const router = express.Router();

router.post(
  "/create-review",
  validateRequest(createReviewSchema),
  createReview,
);

router.get(
  "/approved",
  getAllApprovedReviews,
);

router.get(
  "/pending",
  getAllPendingReviews,
);

router.get(
  "/",
  verifyToken,
  isAdmin,
  getAllReviews,
);

router.get(
  "/:id",
  verifyToken,
  isAdmin,
  validateParams(reviewIdSchema),
  getReviewById,
);

router.patch(
  "/:id/approve",
  verifyToken,
  isAdmin,
  validateParams(reviewIdSchema),
  approveReview,
);

router.patch(
  "/:id/reject",
  verifyToken,
  isAdmin,
  validateParams(reviewIdSchema),
  rejectReview,
);

export default router; 
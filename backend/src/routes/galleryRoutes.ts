import express from "express";
import {
  createGallery,
  deleteGallery,
  updateGallery,
} from "../controllers/galleryController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { validateParams, validateRequest } from "../middleware/validateMiddleware.js";

import {
  createGallerySchema,
  updateGallerySchema,
  galleryIdSchema,
} from "../validator/galleryValidator.js";

const router = express.Router();

router.post(
  "/create-gallery",
  verifyToken,
  isAdmin,
  validateRequest(createGallerySchema),
  createGallery,
);

router.patch(
  "/update-gallery/:id",
  verifyToken,
  isAdmin,
  validateParams(galleryIdSchema),
  validateRequest(updateGallerySchema),
  updateGallery,
);

router.delete(
  "/delete-gallery/:id",
  verifyToken,
  isAdmin,
  validateParams(galleryIdSchema),
  deleteGallery,
);

export default router;

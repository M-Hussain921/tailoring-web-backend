import express from "express";
import {
  createGallery,
  deleteGallery,
  updateGallery,
  getGallery,
  getGalleryById,
  getGalleryByCategory
} from "../controllers/galleryController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { validateParams, validateRequest, validateQuery } from "../middleware/validateMiddleware.js";

import {
  createGallerySchema,
  updateGallerySchema,
  galleryIdSchema,
  galleryQuerySchema
} from "../validator/galleryValidator.js";

const router = express.Router();

router.get(
  "/",
  getGallery,
);

router.post(
  "/create-gallery",
  verifyToken,
  isAdmin,
  validateRequest(createGallerySchema),
  createGallery,
);

router.get(
  "/",
  validateQuery(galleryQuerySchema),
  getGalleryByCategory,
);

router.get(
  "/:id",
  validateParams(galleryIdSchema),
  getGalleryById,
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

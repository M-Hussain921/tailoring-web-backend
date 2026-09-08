import express from "express";
import {
  createGallery
} from "../controllers/galleryController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  createGallerySchema
} from "../validator/galleryValidator.js";

const router = express.Router();

router.post(
  "/create-gallery",
  verifyToken,
  isAdmin,
  validateRequest(createGallerySchema),
  createGallery,
);

export default router;
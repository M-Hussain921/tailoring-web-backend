import express from "express";
import { createService } from "../controllers/servicesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

import { validateRequest } from "../middleware/validateMiddleware.js";
import { createServicesSchema } from "../validator/servicesValidator.js";

const router = express.Router();

router.post(
  "/create-service",
  verifyToken,
  isAdmin,
  validateRequest(createServicesSchema),
  createService,
);

export default router;

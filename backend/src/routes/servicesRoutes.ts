import express from "express";
import {
  createService,
  updateService,
  deleteService,
} from "../controllers/servicesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  createServicesSchema,
  updateServicesSchema,
  serviceIdSchema,
} from "../validator/servicesValidator.js";

const router = express.Router();

router.post(
  "/create-service",
  verifyToken,
  isAdmin,
  validateRequest(createServicesSchema),
  createService,
);

router.put(
  "/update-service/:id",
  verifyToken,
  isAdmin,
  validateRequest(updateServicesSchema),
  updateService,
);

router.delete(
  "/delete-service/:id",
  verifyToken,
  isAdmin,
  validateRequest(serviceIdSchema),
  deleteService,
);

export default router;

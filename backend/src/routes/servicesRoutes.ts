import express from "express";
import {
  createService,
  updateService,
  deleteService,
  getServices,
  getServiceById
} from "../controllers/servicesController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

import { validateParams, validateRequest } from "../middleware/validateMiddleware.js";
import {
  createServicesSchema,
  updateServicesSchema,
  serviceIdSchema,
} from "../validator/servicesValidator.js";

const router = express.Router();

router.get(
  "all-service",
  getServices,
)

router.post(
  "/create-service",
  verifyToken,
  isAdmin,
  validateRequest(createServicesSchema),
  createService,
);

router.get(
  "/:id",
  validateParams(serviceIdSchema),
  getServiceById,
);

router.put(
  "/update-service/:id",
  verifyToken,
  isAdmin,
  validateParams(serviceIdSchema),
  validateRequest(updateServicesSchema),
  updateService,
);

router.delete(
  "/delete-service/:id",
  verifyToken,
  isAdmin,
  validateParams(serviceIdSchema),
  deleteService,
);

export default router;

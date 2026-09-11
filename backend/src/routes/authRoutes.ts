import express from "express";
import { login } from "../controllers/authController.js";
import { acceptAdminInvite } from "../controllers/adminInviteController.js";

import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  loginSchema,
  acceptAdminInviteSchema,
} from "../validator/authValidator.js";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), login);

router.post(
  "/admin/accept-invite",
  validateRequest(acceptAdminInviteSchema),
  acceptAdminInvite,
);

export default router;

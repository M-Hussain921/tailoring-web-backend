import express from "express";
import { login } from "../controllers/authController.js";
import { acceptAdminInvite } from "../controllers/adminInviteController.js";

import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  loginSchema,
  acceptAdminInviteSchema,
} from "../validator/authValidator.js";
import { loginRateLimiter } from "../handler/ratelimit.js";

const router = express.Router();

router.post("/login", loginRateLimiter, validateRequest(loginSchema), login);

router.post(
  "/admin/accept-invite",
  validateRequest(acceptAdminInviteSchema),
  acceptAdminInvite,
);

export default router;

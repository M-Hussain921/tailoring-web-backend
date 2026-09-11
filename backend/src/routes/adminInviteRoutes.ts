import express from "express";
import { inviteAdmin } from "../controllers/adminInviteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isDeveloper } from "../middleware/roleMiddleware.js";
import { adminInviteRateLimiter } from "../handler/ratelimit.js";

const router = express.Router();

router.post(
  "/invite/admin",
  adminInviteRateLimiter,
  verifyToken,
  isDeveloper,
  inviteAdmin,
);

export default router;

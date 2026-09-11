import express from "express";
import { inviteAdmin } from "../controllers/adminInviteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isDeveloper } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/invite/admin", verifyToken, isDeveloper, inviteAdmin);

export default router;

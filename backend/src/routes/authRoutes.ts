import express from "express";
import { login } from "../controllers/authController.js";

import { validateRequest } from "../middleware/validateMiddleware.js";
import { loginSchema } from "../validator/authValidator.js";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), login);

export default router;

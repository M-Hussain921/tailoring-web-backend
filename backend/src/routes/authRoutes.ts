import express from "express";
import { register, login } from "../controllers/authController.js";

import { validateRequest } from "../middleware/validateMiddleware.js";
import { registerSchema, loginSchema } from "../validator/authValidator.js";

const router = express.Router();

router.post("/register",validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

export default router;

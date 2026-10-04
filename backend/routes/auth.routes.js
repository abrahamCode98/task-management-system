import { Router } from "express";
import {
  validateRegister,
  validateLogin,
  validateEmailVerification,
} from "../middleware/validation.middleware.js";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getCurrentUserController,
  verifyEmailController,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.get("/me", protect, getCurrentUserController);
router.post("/verify-email", validateEmailVerification, verifyEmailController);
export default router;

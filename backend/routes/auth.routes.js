import { Router } from "express";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validation.middleware.js";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getCurrentUserController,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.get("/me", protect, getCurrentUserController);
export default router;

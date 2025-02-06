import { Router } from "express";
import {
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from "./login";
const router = Router();

router.post("/verify-otp", verifyOtp);
router.post("/send-otp", sendOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

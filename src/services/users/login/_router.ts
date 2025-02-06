import { Router } from "express";
import {
  forgotPassword,
  loginWithEmail,
  loginWithMobile,
  resetPassword,
  sendOtp,
  sendOtpMobile,
  signup,
  verify,
} from "./login";
const router = Router();

router.post("/signup", signup);
router.post("/verify", verify);
router.post("/login", loginWithEmail);
router.post("/login-with-mobile", loginWithMobile);
router.post("/send_otp", sendOtp);
router.post("/send_otp_mobile", sendOtpMobile);
router.post("/forgot_password", forgotPassword);
router.post("/reset_password", resetPassword);

export default router;

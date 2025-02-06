import { Router } from "express";
import { login,sendOtp,forgotPassword,resetPassword } from "./login";
const router = Router();

router.post('/login', login);
router.post('/send_otp', sendOtp);
router.post('/forgot_password', forgotPassword);
router.post('/reset_password', resetPassword);

export default router;
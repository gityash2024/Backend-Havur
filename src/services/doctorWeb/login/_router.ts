import { Router } from "express";
import { login, sendOtp, signup, verifyOtp, forgotPassword, resetPassword } from "./login";
const router = Router();

router.post('/signup', signup);
router.post('/verifyOtp', verifyOtp);
router.post('/send_otp', sendOtp);
router.post('/login', login);
router.post('/forgot_password',forgotPassword );
router.post('/reset_password', resetPassword);


export default router;
import { Router } from "express";
import { checkPhoneHandler, loginHandler, registerHandler, sendOtpHandler, verifyOtpHandler } from "./auth.controller";

const router = Router();

router.post("/send-otp", sendOtpHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/check-phone", checkPhoneHandler);
router.post("/register", registerHandler);
router.post("/login", loginHandler);

export const AuthRoutes = router;
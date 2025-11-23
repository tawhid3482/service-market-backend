
// auth.controller.ts
import { Request, Response } from "express";
import { otpService } from "./otp.service";
import { authService } from "./auth.service";
import { ConversationRelaySession } from "twilio/lib/twiml/VoiceResponse";


export async function sendOtpHandler(req: Request, res: Response) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const result = await otpService.sendOTPToBoth(phone);
    console.log(result)
    if (result.success) {
      // Extract method, testMode, and testOtp from whatsapp result if available
      const whatsappResult = result.results?.whatsapp;
      const method = whatsappResult?.method || "unknown";
      const testMode = whatsappResult?.testMode;
      const testOtp = whatsappResult?.testOtp;

      return res.json({
        message: result.message || "OTP sent",
        success: true,
        method,
        testMode,
        testOtp
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: result.message, 
        whatsappError: (result as any)?.whatsappError, 
        smsError: (result as any)?.smsError 
      });
    }
  } catch (err) {
    console.error("sendOtpHandler err:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function verifyOtpHandler(req: Request, res: Response) {
  try {
    const { phone, otp, fullName, email } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP required" });

    const otpResult = otpService.verifyOTP(phone, otp);
    if (!otpResult.success) return res.status(400).json({ success: false, message: otpResult.message });

    // find user
    const user = await authService.findUserByPhone(phone);
    if (user) {
      const token = require("../utils/jwt.util").signJwt({ id: user.id });
      const safeUser = { ...user, password: undefined };
      return res.json({ message: "Login successful", token, user: safeUser, isNewUser: false });
    }

    // create user
    try {
      const { user: newUser, token } = await authService.createUserViaOtp({ phone, fullName, email });
      return res.json({ message: "Account created and login successful", token, user: newUser, isNewUser: true });
    } catch (createErr: any) {
      console.error("create user error:", createErr);
      return res.status(500).json({ message: createErr.message || "Failed to create user" });
    }
  } catch (err) {
    console.error("verifyOtpHandler err:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function checkPhoneHandler(req: Request, res: Response) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    // deprecated behavior: always return exists: false to force OTP flow
    return res.json({ exists: false, useOtpFlow: true });
  } catch (err) {
    console.error("checkPhoneHandler err:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function registerHandler(req: Request, res: Response) {
  try {
    const { phone, fullName, email, address, password, isOtpVerified } = req.body;

    if (!phone || !fullName || !email) {
      return res.status(400).json({ message: "Phone, name, and email are required" });
    }

    if (!isOtpVerified && !password) {
      return res.status(400).json({ message: "Password required for non-OTP registration" });
    }

    try {
      const { user, token } = await authService.registerUser({ phone, fullName, email, password, address });
      return res.status(201).json({ message: "User registered successfully", token, user });
    } catch (svcErr: any) {
      console.error("register service error:", svcErr);
      if (svcErr.message.includes("Phone")) {
        return res.status(400).json({ message: svcErr.message });
      }
      return res.status(500).json({ message: svcErr.message || "Server error" });
    }
  } catch (err) {
    console.error("registerHandler err:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ message: "Phone and password are required" });

    try {
      const { user, token } = await authService.loginUser({ phone, password });
      return res.json({ message: "Login successful", token, user });
    } catch (loginErr: any) {
      console.error("login error:", loginErr);
      return res.status(401).json({ message: loginErr.message || "Invalid credentials" });
    }
  } catch (err) {
    console.error("loginHandler err:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

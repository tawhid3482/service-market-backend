import twilio from "twilio";

// Environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || ""; // SMS sender

// Twilio client
const client = twilio(accountSid, authToken);

// Ensure WhatsApp number has proper prefix
const whatsappFrom = TWILIO_PHONE_NUMBER.startsWith("whatsapp:")
  ? TWILIO_PHONE_NUMBER
  : `whatsapp:${TWILIO_PHONE_NUMBER}`;

// Test config
const TEST_MODE = process.env.TEST_MODE === "true";
const TEST_OTP = process.env.TEST_OTP || "123456";

// In-memory OTP store (production: use Redis or DB)
type OtpRecord = { otp: string; expiresAt: number; attempts: number };
const otpStore = new Map<string, OtpRecord>();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhone(phone: string): string {
  let p = phone.trim();
  if (!p.startsWith("+")) {
    p = "+" + p.replace(/^0+/, "");
  }
  return p;
}

// Send WhatsApp OTP
export async function sendWhatsAppOTP(rawPhone: string) {
  try {
    const phone = normalizePhone(rawPhone);
    const otp = otpStore.get(phone)?.otp || (TEST_MODE ? TEST_OTP : generateOTP());
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(phone, { otp, expiresAt, attempts: 0 });

    if (TEST_MODE) {
      console.log(`[TEST_MODE] WhatsApp OTP for ${phone}: ${otp}`);
      return { success: true, method: "whatsapp", testMode: true, testOtp: otp };
    }

    const message = await client.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${phone}`,
      body: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
    });

    return { success: true, method: "whatsapp", messageId: message.sid };
  } catch (error: any) {
    console.error("WhatsApp send error:", error?.message ?? error);
    return { success: false, method: "whatsapp", message: error?.message || String(error) };
  }
}

// Send SMS OTP
export async function sendSMSOTP(rawPhone: string) {
  try {
    const phone = normalizePhone(rawPhone);
    const otp = otpStore.get(phone)?.otp || (TEST_MODE ? TEST_OTP : generateOTP());
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(phone, { otp, expiresAt, attempts: 0 });

    if (TEST_MODE) {
      console.log(`[TEST_MODE] SMS OTP for ${phone}: ${otp}`);
      return { success: true, method: "sms", testMode: true, testOtp: otp };
    }

    const message = await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to: phone,
      body: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
    });

    return { success: true, method: "sms", messageId: message.sid };
  } catch (error: any) {
    console.error("SMS send error:", error?.message ?? error);
    return { success: false, method: "sms", message: error?.message || String(error) };
  }
}

// Send OTP with fallback: WhatsApp → SMS
export async function sendOTPWithFallback(rawPhone: string) {
  const formatted = normalizePhone(rawPhone);
  const otp = TEST_MODE ? TEST_OTP : generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(formatted, { otp, expiresAt, attempts: 0 });

  // Try WhatsApp first
  const wa = await sendWhatsAppOTP(formatted);
  if (wa.success) {
    return {
      success: true,
      method: "whatsapp",
      message: "OTP sent via WhatsApp",
      otp,
      result: wa,
    };
  }

  // If WhatsApp fails, fallback to SMS
  const sms = await sendSMSOTP(formatted);
  if (sms.success) {
    return {
      success: true,
      method: "sms",
      message: "WhatsApp failed, OTP sent via SMS",
      otp,
      result: sms,
    };
  }

  // If both fail
  return {
    success: false,
    method: "none",
    message: "Failed to send OTP via WhatsApp and SMS",
  };
}

// Verify OTP
export function verifyOTP(phone: string, otp: string) {
  const formatted = normalizePhone(phone);
  const record = otpStore.get(formatted);
  if (!record) return { success: false, message: "OTP not found or expired" };

  if (Date.now() > record.expiresAt) {
    otpStore.delete(formatted);
    return { success: false, message: "OTP has expired" };
  }

  if (record.attempts >= 3) {
    otpStore.delete(formatted);
    return { success: false, message: "Maximum verification attempts exceeded" };
  }

  if (record.otp === otp) {
    otpStore.delete(formatted);
    return { success: true, message: "OTP verified successfully" };
  } else {
    record.attempts += 1;
    otpStore.set(formatted, record);
    return { success: false, message: `Invalid OTP. ${3 - record.attempts} attempts remaining` };
  }
}

// Clean expired OTPs every 5 mins
export function cleanExpiredOTPs() {
  const now = Date.now();
  for (const [phone, rec] of otpStore.entries()) {
    if (now > rec.expiresAt) otpStore.delete(phone);
  }
}
setInterval(cleanExpiredOTPs, 5 * 60 * 1000);

// Export service
export const otpService = {
  sendWhatsAppOTP,
  sendSMSOTP,
  sendOTPWithFallback,
  verifyOTP,
  cleanExpiredOTPs,
  generateOTP,
};

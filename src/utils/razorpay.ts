import Razorpay from "razorpay";
import crypto from "crypto";
import { AppError } from "./error.handler";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

let client: Razorpay | null = null;

if (keyId && keySecret) {
  client = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export const createRazorpayOrder = async ({
  amount,
  receipt,
  currency = "INR",
}: {
  amount: number;
  receipt: string;
  currency?: string;
}) => {
  if (!client) {
    throw new AppError("Razorpay is not configured", 500);
  }

  return client.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt,
  });
};

export const verifyRazorpaySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  if (!keySecret) {
    throw new AppError("Razorpay is not configured", 500);
  }

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

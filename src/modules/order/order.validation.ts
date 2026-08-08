import { z } from "zod";

export const createOrderSchema = z.object({
  shippingAddress: z.string().min(1, "Shipping address is required"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  paymentId: z.string().optional(),
});

export const paymentVerificationSchema = z.object({
  orderId: z.string().min(1, "Order id is required"),
  razorpay_order_id: z.string().min(1, "Razorpay order id is required"),
  razorpay_payment_id: z.string().min(1, "Razorpay payment id is required"),
  razorpay_signature: z.string().min(1, "Razorpay signature is required"),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type PaymentVerificationDTO = z.infer<typeof paymentVerificationSchema>;

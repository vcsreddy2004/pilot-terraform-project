import { z } from "zod";

const emailField = z.string().trim().min(1, "Email is required").email("Invalid email format").toLowerCase();

// Schemas
export const emailSchema = z.object({
  email: emailField,
});

export const getOTPDataSchema = z.object({
  email: emailField,
  otp: z.string().trim().min(1, "OTP is required"),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").toLowerCase(),
  email: emailField,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().trim().min(1, "Password is required"),
});

export const updatePasswordSchema = z.object({
  email: emailField,
  otp: z.string().trim().min(1, "OTP is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// DTOs
export type EmailDTO = z.infer<typeof emailSchema>;
export type GetOTPDataDTO = z.infer<typeof getOTPDataSchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type UpdatePasswordDTO = z.infer<typeof updatePasswordSchema>;
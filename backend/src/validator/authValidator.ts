import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, {
      error: "Username must be at least 3 characters long",
    })
    .max(30, {
      error: "Username must be at most 30 characters long",
    }),

  email: z.email({
    error: "Please enter a valid email address",
  }),

  phoneNumber: z
    .string()
    .trim()
    .transform((value) => {
      if (value.startsWith("+91")) {
        return value;
      }
      if (value.startsWith("91")) {
        return `+${value}`;
      }
      return `+91${value}`;
    })
    .refine((value) => /^\+91[6-9]\d{9}$/.test(value), {
      error: "Please enter a valid Indian phone number",
    }),

  password: z
    .string()
    .min(8, {
      error: "Password must be at least 8 characters long",
    })
    .max(100, {
      error: "Password cannot exceed 100 characters",
    }),
});

export const loginSchema = z.object({ 
  identifier: z
    .string()
    .trim()
    .min(1, {
      error: "Email or phone number is required",
    })
     .transform((value) => {
      if (/^[6-9]\d{9}$/.test(value)) {
        return `+91${value}`;
      }

      return value.toLowerCase();
    }),

  password: z.string().min(1, {
    error: "Password is required",
  }),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, {
      error: "Username must be at least 3 characters long",
    })
    .max(30, {
      error: "Username cannot exceed 30 characters",
    })
    .optional(),

  email: z
    .email({
      error: "Please enter a valid email address",
    })
    .optional(),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      error: "Please enter a valid phone number",
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, {
    error: "Current password is required",
  }),

  newPassword: z
    .string()
    .min(8, {
      error: "New password must be at least 8 characters long",
    })
    .max(100, {
      error: "New password cannot exceed 100 characters",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
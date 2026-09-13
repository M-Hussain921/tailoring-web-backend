import { z } from "zod";

const booleanFromFormData = z
  .string()
  .refine((value) => value === "true" || value === "false", {
    error: "Value must be true or false",
  })
  .transform((value) => value === "true");

export const createServicesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      error: "Name must be at least 3 characters long",
    })
    .max(50, {
      error: "Name cannot exceed 50 characters",
    }),

  slug: z
    .string()
    .trim()
    .min(3, {
      error: "Slug must be at least 3 characters long",
    })
    .max(50, {
      error: "Slug cannot exceed 50 characters",
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),

  description: z
    .string()
    .trim()
    .min(10, {
      error: "Description must be at least 10 characters long",
    })
    .max(200, {
      error: "Description cannot exceed 200 characters",
    }),

  price: z.coerce.number().min(0, {
    error: "Price must be a positive number",
  }),

  features: z
    .string()
    .transform((value, ctx) => {
      try {
        return JSON.parse(value);
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Features must be a valid JSON array",
        });

        return z.NEVER;
      }
    })
    .pipe(
      z
        .array(
          z.string().trim().min(1, {
            error: "Feature cannot be empty",
          }),
        )
        .min(1, {
          error: "At least one feature is required",
        }),
    ),

  isFeatured: booleanFromFormData.optional(),

  isActive: booleanFromFormData.optional(),
});

export const updateServicesSchema = createServicesSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided for update",
  });

export const serviceIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, {
    error: "Invalid service ID",
  }),
});

export type CreateServiceInput = z.infer<typeof createServicesSchema>;
export type UpdateServiceInput = z.infer<typeof updateServicesSchema>;
export type ServiceIdInput = z.infer<typeof serviceIdSchema>;

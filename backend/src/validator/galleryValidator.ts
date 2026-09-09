import { z } from "zod";

export const createGallerySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, {
        error: "Title must be at least 3 characters long",
      })
      .max(100, {
        error: "Title must be at most 100 characters long",
      }),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, {
        error: "Slug must be at least 3 characters long",
      })
      .max(100, {
        error: "Slug must be at most 100 characters long",
      })
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        error: "Slug can only contain lowercase letters, numbers, and hyphens",
      }),
    description: z.string().trim().max(300, {
      error: "Description must be at most 300 characters long",
    }),
    image: z.object({
      url: z.url({
        error: "Please enter a valid URL for the image",
      }),
      publicId: z.string().trim().min(1, {
        error: "Image Public ID is required",
      }),
    }),
    category: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(
        z.enum([
          "shirt",
          "pant",
          "kurta",
          "suit",
          "sherwani",
          "blazer",
          "other",
        ]),
      ),
    tags: z
      .array(
        z.string().trim().min(1, {
          error: "tag cannot be empty",
        }),
      )
      .min(1, {
        error: "At least one tag is required",
      }),
    altText: z.string().trim().max(150, {
      error: "altText cannot exceed 150 characters",
    }),
    displayOrder: z
      .number()
      .int({
        error: "Display order must be an integer",
      })
      .min(0, {
        error: "Display order cannot be negative",
      })
      .optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const updateGallerySchema = createGallerySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided for update",
  });

export const galleryIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, {
    error: "Invalid service ID",
  }),
});

export const galleryQuerySchema = z.object({
  category: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z.enum([
        "shirt",
        "pant",
        "kurta",
        "suit",
        "sherwani",
        "blazer",
        "other",
      ]),
    )
    .optional(),
});

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
export type GalleryIdInput = z.infer<typeof galleryIdSchema>;
export type GalleryQueryInput = z.infer<typeof galleryQuerySchema>;

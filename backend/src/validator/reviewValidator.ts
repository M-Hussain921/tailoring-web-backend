import { z } from "zod";

export const createReviewSchema = z
  .object({
    customerName: z
      .string()
      .trim()
      .min(2, {
        error: "Customer name must be at least 2 characters long",
      })
      .max(50, {
        error: "Customer name cannot exceed 50 characters",
      }),

    rating: z
      .number()
      .int({
        error: "Rating must be an integer",
      })
      .min(1, {
        error: "Rating must be at least 1",
      })
      .max(5, {
        error: "Rating cannot exceed 5",
      }),

    comment: z
      .string()
      .trim()
      .min(10, {
        error: "Comment must be at least 10 characters long",
      })
      .max(500, {
        error: "Comment cannot exceed 500 characters",
      }),
  })
  .strict();

export const reviewIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, {
    error: "Invalid review ID",
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewIdInput = z.infer<typeof reviewIdSchema>;

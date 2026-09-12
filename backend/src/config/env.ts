import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),

  DEVELOPER_EMAIL: z.email(),
  DEVELOPER_PHONE: z.string().min(10),
  DEVELOPER_PASSWORD: z.string().min(8),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);

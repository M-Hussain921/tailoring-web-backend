import {z} from "zod";

const envSchema = z.object({
      MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),

  DEVELOPER_EMAIL: z.string().email(),
  DEVELOPER_PHONE: z.string().min(10),
  DEVELOPER_PASSWORD: z.string().min(8),

  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
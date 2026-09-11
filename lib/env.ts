import { z } from "zod";

const databaseUrlSchema = z.string().url();

const serverEnvSchema = z.object({
  MIDTRANS_SERVER_KEY: z.string().min(1),
  NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: z.string().min(1),
  MIDTRANS_IS_PRODUCTION: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export function getDatabaseUrl() {
  return databaseUrlSchema.parse(process.env.DATABASE_URL);
}

export function getServerEnv() {
  return serverEnvSchema.parse({
    MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
    NEXT_PUBLIC_MIDTRANS_CLIENT_KEY:
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    MIDTRANS_IS_PRODUCTION: process.env.MIDTRANS_IS_PRODUCTION,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
}

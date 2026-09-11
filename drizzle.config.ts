import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

const migrationUrl = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error("DATABASE_MIGRATION_URL atau DATABASE_URL belum dikonfigurasi");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: migrationUrl,
  },
});

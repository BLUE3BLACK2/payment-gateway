import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

const globalDatabase = globalThis as typeof globalThis & {
  databasePool?: Pool;
};

const pool =
  globalDatabase.databasePool ??
  new Pool({
    connectionString: getDatabaseUrl(),
  });

if (process.env.NODE_ENV !== "production") {
  globalDatabase.databasePool = pool;
}

export const db = drizzle(pool, { schema });

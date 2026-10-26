import { fileURLToPath } from "node:url";
import process from "node:process";
import dotenv from "dotenv";
import pg from "pg";

// Resolve relative to this module so scripts work from any directory.
// Existing environment variables (including Railway secrets) take precedence.
dotenv.config({ path: fileURLToPath(new URL("../config.env", import.meta.url)) });

export function createPostgresPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Set DATABASE_URL in apps/api/config.env or the process environment.");
  }

  return new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
}

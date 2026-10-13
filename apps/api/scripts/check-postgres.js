import process from "node:process";
import { createPostgresPool } from "../db/postgres.js";

let pool;
try {
  pool = createPostgresPool();
  await pool.query("SELECT 1");
  console.log("PostgreSQL connection OK.");
} catch (error) {
  // Avoid logging connection URLs or credentials from driver errors.
  console.error("PostgreSQL connection failed. Check DATABASE_URL, credentials, and that PostgreSQL is running.");
  if (error.code) console.error(`Error code: ${error.code}`);
  process.exitCode = 1;
} finally {
  if (pool) await pool.end();
}

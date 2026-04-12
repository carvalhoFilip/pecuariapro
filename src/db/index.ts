import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let sql: ReturnType<typeof neon> | null = null;
let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL não está definida.");
  }
  if (!sql) {
    sql = neon(databaseUrl);
  }
  if (!dbInstance) {
    dbInstance = drizzle(sql, { schema });
  }
  return dbInstance;
}

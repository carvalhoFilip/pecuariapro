/**
 * Aplica migrações SQL em `drizzle/` via HTTP (mesmo driver que a app).
 * Uso: `npm run db:migrate`
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Defina DATABASE_URL em .env.local");
  process.exit(1);
}

const sql = neon(url);
const db = drizzle(sql);

await migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrações aplicadas com sucesso.");

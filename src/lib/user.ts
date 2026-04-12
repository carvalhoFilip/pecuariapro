import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";

/**
 * Garante que exista um registro em `users` alinhado ao usuário do Neon Auth.
 * O `id` do Neon Auth precisa ser um UUID válido no PostgreSQL.
 */
export async function ensureAppUser(input: { id: string; email: string }) {
  const db = getDb();
  const existing = await db.select().from(users).where(eq(users.id, input.id)).limit(1);
  if (existing[0]) {
    return existing[0];
  }
  await db.insert(users).values({
    id: input.id,
    email: input.email,
  });
  const [created] = await db.select().from(users).where(eq(users.id, input.id));
  return created;
}

import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { tryLinkStripeSubscriptionByEmail } from "@/lib/stripe-subscription";

function rethrowDbConnectionHelp(err: unknown): never {
  if (err instanceof NeonDbError && err.code === "28P01") {
    throw new Error(
      "DATABASE_URL: senha incorreta ou placeholder. No Neon Console copie a connection string (pooled) e substitua em .env.local — o login já funcionou; falta alinhar a mesma base.",
    );
  }
  if (err instanceof NeonDbError && err.code === "42P01") {
    throw new Error(
      'Tabelas em falta: na raiz do projeto corra `npm run db:migrate` (ou execute o ficheiro `drizzle/manual_apply_all.sql` no SQL Editor do Neon).',
    );
  }
  if (err instanceof Error && /password authentication failed/i.test(err.message)) {
    throw new Error(
      "DATABASE_URL: falha de autenticação no PostgreSQL. Atualize a connection string no .env.local com a senha real do role (ex.: neondb_owner).",
    );
  }
  if (err instanceof Error && /relation "users" does not exist/i.test(err.message)) {
    throw new Error(
      'Tabela `users` inexistente: corra `npm run db:migrate` ou aplique `drizzle/manual_apply_all.sql` no Neon.',
    );
  }
  throw err;
}

/**
 * Garante que exista um registro em `users` alinhado ao usuário do Neon Auth.
 * O `id` do Neon Auth precisa ser um UUID válido no PostgreSQL.
 */
export async function ensureAppUser(input: { id: string; email: string }) {
  try {
    const db = getDb();
    const normalizedEmail = input.email.trim().toLowerCase();
    // Upsert: layout e página do dashboard podem chamar isto em paralelo; dois INSERTs
    // geram duplicate key em `users_pkey` sem ON CONFLICT.
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let row: typeof users.$inferSelect | undefined;
    try {
      [row] = await db
        .insert(users)
        .values({
          id: input.id,
          email: normalizedEmail,
          subscriptionStatus: "trialing",
          trialEndsAt,
        })
        .onConflictDoUpdate({
          target: users.id,
          // Apenas email: nunca subscriptionStatus/trialEndsAt para não resetar o período de teste a cada login.
          set: { email: normalizedEmail },
        })
        .returning();
    } catch (err) {
      if (err instanceof NeonDbError && err.code === "23505" && err.constraint === "users_email_unique") {
        const [byEmail] = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
        if (byEmail) row = byEmail;
      } else {
        throw err;
      }
    }
    if (!row) {
      throw new Error("ensureAppUser: upsert não devolveu linha.");
    }
    // Sincroniza assinatura por e-mail para o fluxo checkout -> cadastro -> login.
    // Se falhar, não bloqueia o login/cadastro.
    if (!row.stripeCustomerId) {
      try {
        await tryLinkStripeSubscriptionByEmail(row.id, row.email);
        const [fresh] = await db.select().from(users).where(eq(users.id, row.id)).limit(1);
        if (fresh) return fresh;
      } catch (e) {
        console.warn("Aviso: não foi possível sincronizar assinatura por e-mail:", e);
      }
    }
    return row;
  } catch (e) {
    rethrowDbConnectionHelp(e);
  }
}

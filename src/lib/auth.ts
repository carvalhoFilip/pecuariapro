import { createNeonAuth } from "@neondatabase/auth/next/server";

let authInstance: ReturnType<typeof createNeonAuth> | null = null;

function resolveCookieSecret(): string | null {
  const fromEnv = process.env.NEON_AUTH_COOKIE_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 32) return fromEnv;
  // Só em `next dev`: o SDK exige ≥32 chars; evita obrigar a gerar segredo à mão no .env.local.
  // Em produção (`next build` / deploy) continua obrigatório NEON_AUTH_COOKIE_SECRET no ambiente.
  if (process.env.NODE_ENV === "development") {
    return "pecuariapro-local-dev-neon-auth-cookie-secret-do-not-use-in-prod";
  }
  return null;
}

export function getNeonAuthOrNull() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL?.trim();
  const secret = resolveCookieSecret();
  if (!baseUrl || !secret) {
    return null;
  }
  if (!authInstance) {
    authInstance = createNeonAuth({
      baseUrl,
      cookies: { secret },
    });
  }
  return authInstance;
}

export async function getSessionUser() {
  const auth = getNeonAuthOrNull();
  if (!auth) {
    return { user: null as null, error: "auth_not_configured" as const };
  }
  const { data: session, error } = await auth.getSession();
  if (error || !session?.user) {
    return { user: null as null, error: "unauthorized" as const };
  }
  const u = session.user as { id: string; email: string; name?: string };
  if (!u.id || !u.email) {
    return { user: null as null, error: "unauthorized" as const };
  }
  return { user: { id: u.id, email: u.email, name: u.name }, error: null as null };
}

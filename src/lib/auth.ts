import { createNeonAuth } from "@neondatabase/auth/next/server";

let authInstance: ReturnType<typeof createNeonAuth> | null = null;

export function getNeonAuthOrNull() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !secret || secret.length < 32) {
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

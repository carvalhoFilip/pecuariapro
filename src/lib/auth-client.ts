import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

const cache = new Map<string, ReturnType<typeof createAuthClient>>();

/**
 * Cliente Better Auth apontando para o proxy local `/api/auth` (que repassa ao Neon Auth).
 */
export function getAuthClient() {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000");
  const baseURL = `${origin}/api/auth`;
  let client = cache.get(baseURL);
  if (!client) {
    client = createAuthClient(baseURL, { adapter: BetterAuthReactAdapter() });
    cache.set(baseURL, client);
  }
  return client;
}

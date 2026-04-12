import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { userHasValidSubscriptionAccess } from "@/lib/subscription-access";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";

export type LoggedAppUser = Awaited<ReturnType<typeof ensureAppUser>>;

export type RequireSessionOk = { user: LoggedAppUser };

export type RequireSessionResult =
  | { ok: true; data: RequireSessionOk }
  | { ok: false; response: NextResponse };

export async function requireSessionWithUser(): Promise<RequireSessionResult> {
  const session = await getSessionUser();
  if (session.error === "auth_not_configured") {
    return {
      ok: false,
      response: NextResponse.json(
        { mensagem: "Login ainda não está disponível. Configure o Neon Auth." },
        { status: 503 },
      ),
    };
  }
  if (!session.user) {
    return { ok: false, response: NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 }) };
  }
  if (!isUuidLike(session.user.id)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          mensagem:
            "O identificador da sua conta não é um UUID. Ajuste o Neon Auth (Better Auth) para gerar IDs em UUID.",
        },
        { status: 422 },
      ),
    };
  }
  const user = await ensureAppUser(session.user);
  if (!userHasValidSubscriptionAccess(user.subscriptionStatus, user.trialEndsAt)) {
    return {
      ok: false,
      response: NextResponse.json(
        { mensagem: "Assinatura necessária para aceder a este recurso." },
        { status: 402 },
      ),
    };
  }
  return { ok: true, data: { user } };
}

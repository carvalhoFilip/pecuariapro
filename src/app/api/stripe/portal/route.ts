import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { requireSessionWithUser } from "@/lib/require-session";

function resolveBaseUrl(request: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const fallback = new URL(request.url);
  return `${fallback.protocol}//${fallback.host}`;
}

export async function POST(request: Request) {
  const result = await requireSessionWithUser();
  if (!result.ok) {
    return result.response;
  }

  const { user } = result.data;
  if (!user.stripeCustomerId?.trim()) {
    return NextResponse.json(
      { mensagem: "Conta sem cliente Stripe. Conclua a assinatura para gerir o plano aqui." },
      { status: 400 },
    );
  }

  const baseUrl = resolveBaseUrl(request);

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/assinatura`,
    });
    if (!session.url) {
      return NextResponse.json({ mensagem: "Stripe não retornou URL do portal." }, { status: 502 });
    }
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    console.error("Erro ao criar sessão do portal Stripe:", e);
    return NextResponse.json({ mensagem: "Falha ao abrir o portal de faturação." }, { status: 500 });
  }
}

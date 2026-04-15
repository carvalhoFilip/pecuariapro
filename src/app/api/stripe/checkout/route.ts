import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

function resolveBaseUrl(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const fallback = new URL(request.url);
  return `${fallback.protocol}//${fallback.host}`;
}

function resolveTrialDays(): number {
  const raw = process.env.STRIPE_TRIAL_DAYS?.trim();
  if (!raw) return 7;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 7;
  return parsed;
}

export async function POST(request: Request) {
  const priceId = process.env.STRIPE_PRICE_ID?.trim();
  if (!priceId) {
    return NextResponse.json(
      { mensagem: "Defina STRIPE_PRICE_ID no ambiente para iniciar o checkout." },
      { status: 503 },
    );
  }

  const baseUrl = resolveBaseUrl(request);
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: resolveTrialDays(),
      },
      success_url: `${baseUrl}/dashboard`,
      cancel_url: `${baseUrl}/pagamento?cancelado=1`,
    });
    if (!session.url) {
      return NextResponse.json({ mensagem: "Stripe não retornou URL de checkout." }, { status: 502 });
    }
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Erro ao criar Checkout Session:", error);
    return NextResponse.json({ mensagem: "Falha ao iniciar checkout." }, { status: 500 });
  }
}

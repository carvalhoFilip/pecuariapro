import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { getDb } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function mapStripeSubscriptionToUserStatus(status: string): string {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "paused":
    case "incomplete":
      return "inactive";
    default:
      return "inactive";
  }
}

/** Compatível com Stripe API nova (período no item) e legado (`current_period_end` na raiz). */
function currentPeriodEndDate(sub: Stripe.Subscription): Date | null {
  const item0 = sub.items?.data?.[0];
  if (item0 && typeof item0.current_period_end === "number") {
    return new Date(item0.current_period_end * 1000);
  }
  const legacy = (sub as unknown as { current_period_end?: number }).current_period_end;
  if (typeof legacy === "number") {
    return new Date(legacy * 1000);
  }
  return null;
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const subRef = invoice.parent?.subscription_details?.subscription;
  if (!subRef) return null;
  return typeof subRef === "string" ? subRef : subRef.id;
}

function customerIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const cust = invoice.customer;
  return typeof cust === "string" ? cust : cust && "id" in cust ? cust.id : null;
}

async function findUserIdByStripeCustomer(customerId: string): Promise<string | null> {
  const db = getDb();
  const row = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);
  return row[0]?.id ?? null;
}

async function syncSubscriptionRecord(userId: string, sub: Stripe.Subscription) {
  const db = getDb();
  const status = mapStripeSubscriptionToUserStatus(sub.status);
  const currentPeriodEnd = currentPeriodEndDate(sub);
  const trialEndsAt = sub.trial_end ? new Date(sub.trial_end * 1000) : null;

  await db
    .insert(subscriptions)
    .values({
      userId,
      stripeSubscriptionId: sub.id,
      status,
      currentPeriodEnd,
    })
    .onConflictDoUpdate({
      target: subscriptions.stripeSubscriptionId,
      set: {
        status,
        currentPeriodEnd,
        userId,
      },
    });

  await db
    .update(users)
    .set({
      subscriptionStatus: status,
      trialEndsAt,
    })
    .where(eq(users.id, userId));
}

async function resolveUserIdForCustomer(
  customerId: string,
  meta?: Stripe.Metadata | null,
): Promise<string | null> {
  let userId = await findUserIdByStripeCustomer(customerId);
  if (userId) return userId;
  const fromMeta = meta?.app_user_id ?? meta?.user_id;
  if (fromMeta && fromMeta.length > 0) {
    userId = fromMeta;
    await getDb()
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId));
    return userId;
  }
  return null;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.error("STRIPE_WEBHOOK_SECRET não configurada.");
    }
    return NextResponse.json({ mensagem: "Webhook não configurado." }, { status: 503 });
  }

  const rawBody = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ mensagem: "Assinatura ausente." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Stripe webhook assinatura inválida:", err);
    }
    return NextResponse.json({ mensagem: "Assinatura inválida." }, { status: 400 });
  }

  const db = getDb();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
        const userId =
          session.metadata?.app_user_id ??
          session.metadata?.user_id ??
          (session.client_reference_id || null);
        if (customerId && userId) {
          await db
            .update(users)
            .set({ stripeCustomerId: customerId })
            .where(eq(users.id, userId));
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const cust = sub.customer;
        const customerId = typeof cust === "string" ? cust : cust && "id" in cust ? cust.id : null;
        if (!customerId) break;
        const userId = await resolveUserIdForCustomer(customerId, sub.metadata);
        if (!userId) {
          if (process.env.NODE_ENV === "development") {
            console.warn("Stripe webhook: usuário não encontrado para customer", customerId);
          }
          break;
        }
        await syncSubscriptionRecord(userId, sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const cust = sub.customer;
        const customerId = typeof cust === "string" ? cust : cust && "id" in cust ? cust.id : null;
        if (!customerId) break;
        const userId = await findUserIdByStripeCustomer(customerId);
        if (!userId) break;
        await db
          .update(users)
          .set({ subscriptionStatus: "canceled", trialEndsAt: null })
          .where(eq(users.id, userId));
        if (sub.id) {
          await db
            .update(subscriptions)
            .set({ status: "canceled", currentPeriodEnd: null })
            .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = subscriptionIdFromInvoice(invoice);
        if (!subId) break;
        const stripe = getStripe();
        const sub = await stripe.subscriptions.retrieve(subId, { expand: ["items.data"] });
        const customerId = customerIdFromInvoice(invoice);
        if (!customerId) break;
        const userId = await resolveUserIdForCustomer(customerId, sub.metadata);
        if (!userId) break;
        await syncSubscriptionRecord(userId, sub);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = subscriptionIdFromInvoice(invoice);
        if (!subId) break;
        const stripe = getStripe();
        const sub = await stripe.subscriptions.retrieve(subId, { expand: ["items.data"] });
        const customerId = customerIdFromInvoice(invoice);
        if (!customerId) break;
        const userId = await findUserIdByStripeCustomer(customerId);
        if (!userId) break;
        await db
          .update(users)
          .set({ subscriptionStatus: "past_due" })
          .where(eq(users.id, userId));
        await db
          .update(subscriptions)
          .set({
            status: "past_due",
            currentPeriodEnd: currentPeriodEndDate(sub),
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }
      default:
        break;
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("Erro ao processar webhook Stripe:", e);
    }
    return NextResponse.json({ mensagem: "Erro interno ao processar evento." }, { status: 500 });
  }

  return NextResponse.json({ recebido: true });
}

import { and, desc, eq } from "drizzle-orm";
import type Stripe from "stripe";
import { getDb } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { getStripe } from "@/lib/stripe";

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

function pickBestSubscription(items: Stripe.Subscription[]): Stripe.Subscription | null {
  if (items.length === 0) return null;
  const rank: Record<string, number> = {
    active: 5,
    trialing: 4,
    past_due: 3,
    unpaid: 2,
    canceled: 1,
    incomplete: 0,
    incomplete_expired: 0,
    paused: 0,
  };
  return [...items].sort((a, b) => {
    const byRank = (rank[b.status] ?? 0) - (rank[a.status] ?? 0);
    if (byRank !== 0) return byRank;
    return b.created - a.created;
  })[0]!;
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

/**
 * Melhor esforço: associa usuário recém-cadastrado ao customer Stripe por e-mail e
 * sincroniza o estado da assinatura para liberar acesso sem esperar novo webhook.
 */
export async function tryLinkStripeSubscriptionByEmail(userId: string, email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;

  const stripe = getStripe();
  const db = getDb();
  const customers = await stripe.customers.list({ email: normalizedEmail, limit: 1 });
  const customer = customers.data[0];
  if (!customer || customer.deleted) return;

  await db
    .update(users)
    .set({ stripeCustomerId: customer.id })
    .where(and(eq(users.id, userId), eq(users.email, normalizedEmail)));

  const subscriptionList = await stripe.subscriptions.list({
    customer: customer.id,
    status: "all",
    expand: ["data.items.data"],
    limit: 10,
  });

  const best = pickBestSubscription(subscriptionList.data);
  if (!best) return;
  await syncSubscriptionRecord(userId, best);
}

export async function getCheckoutEmail(sessionId: string): Promise<string | null> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.customer_details?.email?.trim().toLowerCase() ?? null;
}

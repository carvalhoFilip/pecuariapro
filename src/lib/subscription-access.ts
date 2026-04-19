/** Regras de paywall partilhadas entre layout do dashboard e APIs. */

export function isSubscriptionCheckDisabled(): boolean {
  return process.env.SUBSCRIPTION_CHECK_DISABLED === "true";
}

function normalizeTrialEndsAt(value: Date | string | null | undefined): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Acesso ao dashboard e às APIs de dados (vendas, custos, métricas).
 * Estado `trialing` (período de teste): com `trialEndsAt` definido no BD, o fim tem de ser no futuro.
 */
export function userHasValidSubscriptionAccess(
  subscriptionStatus: string | null | undefined,
  trialEndsAt: Date | string | null | undefined,
): boolean {
  if (isSubscriptionCheckDisabled()) return true;
  const status = (subscriptionStatus ?? "inactive").toLowerCase();
  if (status === "active") return true;
  if (status === "trialing") {
    const end = normalizeTrialEndsAt(trialEndsAt);
    if (!end) return true;
    return end.getTime() > Date.now();
  }
  return false;
}

/** Query string para contextualizar a página /pagamento após redirect. */
export function paywallRedirectQuery(
  subscriptionStatus: string | null | undefined,
  trialEndsAt: Date | string | null | undefined,
): string {
  const status = (subscriptionStatus ?? "inactive").toLowerCase();
  const end = normalizeTrialEndsAt(trialEndsAt);
  if (status === "canceled") return "?motivo=cancelado";
  if (status === "past_due" || status === "unpaid") return "?motivo=pagamento";
  if (status === "trialing" && end && end.getTime() <= Date.now()) return "?motivo=trial_expirado";
  return "?motivo=inativo";
}

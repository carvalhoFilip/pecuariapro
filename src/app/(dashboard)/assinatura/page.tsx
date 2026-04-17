import { getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function badgeStatus(status: string | null | undefined) {
  const s = (status ?? "inactive").toLowerCase();
  if (s === "active") {
    return { label: "Ativo", className: "bg-verde-100 text-verde-800 ring-1 ring-verde-200" };
  }
  if (s === "trialing") {
    return { label: "Trial", className: "bg-blue-100 text-blue-800 ring-1 ring-blue-200" };
  }
  if (s === "canceled" || s === "cancelled") {
    return { label: "Cancelado", className: "bg-red-100 text-red-800 ring-1 ring-red-200" };
  }
  if (s === "past_due") {
    return { label: "Pagamento pendente", className: "bg-amber-100 text-amber-900 ring-1 ring-amber-200" };
  }
  return { label: status ?? "—", className: "bg-terra-100 text-terra-700 ring-1 ring-terra-200" };
}

function formatTrialFim(d: Date | null | undefined): string | null {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function AssinaturaPage() {
  const session = await getSessionUser();
  let aviso: string | null = null;
  let subscriptionStatus: string | null = null;
  let trialEndsAt: Date | null = null;
  let stripeCustomerId: string | null = null;

  if (session.error === "auth_not_configured") {
    aviso = "Configure o Neon Auth para ver a sua assinatura.";
  } else if (!session.user) {
    aviso = "Faça login para ver a sua assinatura.";
  } else if (!isUuidLike(session.user.id)) {
    aviso =
      "O id da conta precisa ser UUID para bater com o banco. Ajuste a geração de IDs no Neon Auth (Better Auth).";
  } else {
    try {
      const user = await ensureAppUser(session.user);
      subscriptionStatus = user.subscriptionStatus ?? null;
      trialEndsAt = user.trialEndsAt ?? null;
      stripeCustomerId = user.stripeCustomerId ?? null;
    } catch {
      aviso = "Não foi possível carregar os dados da conta.";
    }
  }

  const badge = badgeStatus(subscriptionStatus);
  const trialLabel = formatTrialFim(trialEndsAt);
  const mostrarTrial = (subscriptionStatus ?? "").toLowerCase() === "trialing" && trialLabel;

  return (
    <div className="mx-auto min-h-0 w-full max-w-[1280px] flex-1 bg-[#fafaf9] px-4 pt-4 pb-8 md:px-8 md:pt-8">
      <h1 className="text-2xl font-bold tracking-tight text-terra-900">Minha assinatura</h1>

      {aviso ? (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{aviso}</p>
      ) : (
        <div className="mt-8 max-w-lg rounded-2xl border border-terra-200 bg-white p-6 shadow-card md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-terra-600">Status:</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-90" aria-hidden />
              {badge.label}
            </span>
          </div>

          <p className="mt-4 text-sm text-terra-700">
            <span className="font-medium text-terra-900">Plano:</span> Pecuária Pro — R$ 39/mês
          </p>

          {mostrarTrial ? (
            <p className="mt-3 text-sm text-terra-700">
              <span className="font-medium text-terra-900">Trial encerra em:</span> {trialLabel}
            </p>
          ) : null}

          <form action="/api/stripe/portal" method="POST" className="mt-8">
            <Button
              type="submit"
              disabled={!stripeCustomerId}
              className="w-full rounded-xl bg-verde-700 py-3.5 text-base font-semibold text-white hover:bg-verde-800 sm:w-auto"
            >
              Gerenciar assinatura →
            </Button>
          </form>

          {!stripeCustomerId ? (
            <p className="mt-3 text-xs text-terra-500">
              O portal da Stripe só fica disponível depois de concluir uma assinatura com este e-mail.
            </p>
          ) : null}

          <p className="mt-8 text-sm leading-relaxed text-terra-600">
            Para cancelar, clique em <span className="font-medium text-terra-800">&quot;Gerenciar assinatura&quot;</span>{" "}
            e cancele dentro do portal do Stripe.
          </p>
        </div>
      )}
    </div>
  );
}

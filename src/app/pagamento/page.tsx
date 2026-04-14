import Link from "next/link";
import { CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const hasCheckoutConfig = Boolean(process.env.STRIPE_PRICE_ID?.trim());

export const metadata = {
  title: "Assinatura | Pecuária Pro",
};

const beneficios = [
  "Vendas e custos ilimitados",
  "Dashboard com gráficos",
  "Cálculo automático de arroba",
  "Histórico completo",
  "Relatórios mensais",
];

const copyPorMotivo: Record<
  string,
  { titulo: string; subtitulo: string }
> = {
  inativo: {
    titulo: "Comece o seu período gratuito",
    subtitulo: "7 dias grátis para explorar o Pecuária Pro. Depois, R$ 39/mês. Cancele quando quiser.",
  },
  trial_expirado: {
    titulo: "O seu período grátis terminou",
    subtitulo: "Assine para continuar a registar vendas e custos, e a usar o dashboard com gráficos e histórico completo.",
  },
  cancelado: {
    titulo: "Reative a sua assinatura",
    subtitulo: "A sua conta está sem plano ativo. Recomece em minutos e recupere o histórico e os relatórios.",
  },
  pagamento: {
    titulo: "Pagamento em atraso",
    subtitulo:
      "O último pagamento não foi concluído. Regularize na Stripe ou refaça o checkout com o mesmo email da conta.",
  },
};

/** Mantém o UI de loading visível pelo menos este tempo (navegação landing/login → /pagamento). */
const PAGAMENTO_MIN_LOAD_MS = 2_000;

export default async function PagamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;
  await new Promise((resolve) => setTimeout(resolve, PAGAMENTO_MIN_LOAD_MS));
  const copy = copyPorMotivo[motivo ?? ""] ?? {
    titulo: "Acesse o Pecuária Pro",
    subtitulo: "7 dias grátis, depois R$ 39/mês. Cancele quando quiser.",
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center overflow-x-hidden overscroll-y-none bg-terra-50 px-4 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-terra-200 bg-white p-6 shadow-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-verde-100">
          <Lock className="h-8 w-8 text-verde-700" aria-hidden />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-terra-950">{copy.titulo}</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-terra-600">{copy.subtitulo}</p>
        <ul className="mt-8 space-y-3">
          {beneficios.map((t) => (
            <li key={t} className="flex items-start gap-3 text-sm text-terra-800">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-verde-600" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-col gap-3">
          {hasCheckoutConfig ? (
            <form action="/api/stripe/checkout" method="POST">
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-xl bg-verde-700 py-4 text-base font-semibold text-white hover:bg-verde-800"
              >
                Começar 7 dias grátis
              </Button>
            </form>
          ) : (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Configure <span className="font-medium">STRIPE_PRICE_ID</span> no ambiente.
            </p>
          )}
          <Button asChild variant="outline" className="w-full rounded-xl border-terra-200 py-4 text-base">
            <Link href="/">Voltar para a página inicial</Link>
          </Button>
        </div>
        <p className="mt-6 text-center text-xs text-terra-500">Sem fidelidade. Cancele a qualquer momento.</p>
      </div>
    </div>
  );
}

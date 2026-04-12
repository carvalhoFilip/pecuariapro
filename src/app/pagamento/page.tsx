import Link from "next/link";
import { Button } from "@/components/ui/button";

const checkoutHref =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? process.env.STRIPE_PAYMENT_LINK ?? "";

export const metadata = {
  title: "Assinatura | Pecuária Pro",
};

export default function PagamentoPage() {
  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-16">
      <div className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Ative sua assinatura</h1>
        <p className="mt-3 text-base text-neutral-700">
          Para usar o painel, as vendas e os custos, é preciso um plano ativo ou período de teste. Você começa com 7
          dias grátis e pode cancelar quando quiser.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {checkoutHref ? (
            <Button asChild size="lg" className="w-full">
              <a href={checkoutHref} target="_blank" rel="noopener noreferrer">
                Ir para o pagamento seguro
              </a>
            </Button>
          ) : (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Configure <span className="font-medium">STRIPE_PAYMENT_LINK</span> ou{" "}
              <span className="font-medium">NEXT_PUBLIC_STRIPE_PAYMENT_LINK</span> no ambiente.
            </p>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

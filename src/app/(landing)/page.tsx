import Link from "next/link";
import { Button } from "@/components/ui/button";

const stripeHref =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? process.env.STRIPE_PAYMENT_LINK ?? "";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <span className="text-lg font-bold text-emerald-800">Pecuária Pro</span>
        <Button asChild variant="ghost" className="min-h-10 text-emerald-900">
          <Link href="/login">Entrar</Link>
        </Button>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">Gestão financeira da fazenda</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-emerald-950 sm:text-4xl lg:text-5xl">
            Se você não controla sua arroba, você não controla seu lucro.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-700 sm:text-xl">
            Registre suas vendas, veja seus custos e descubra quanto realmente está lucrando — sem planilha.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {stripeHref ? (
              <Button asChild size="lg" className="w-full text-lg sm:w-auto">
                <a href={stripeHref} target="_blank" rel="noopener noreferrer">
                  Começar 7 dias grátis
                </a>
              </Button>
            ) : (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                Defina <span className="font-medium">STRIPE_PAYMENT_LINK</span> ou{" "}
                <span className="font-medium">NEXT_PUBLIC_STRIPE_PAYMENT_LINK</span> no ambiente para abrir o
                pagamento.
              </p>
            )}
          </div>
          <p className="mt-4 text-sm text-neutral-600">Sem cartão para testar. Cancele quando quiser.</p>
        </section>

        <section className="border-y border-neutral-200 bg-neutral-50 py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-emerald-950">Talvez isso esteja te incomodando</h2>
            <ul className="mt-8 space-y-4 text-lg text-neutral-800">
              <li className="flex gap-3">
                <span aria-hidden>❌</span>
                <span>Você vende gado, mas não sabe o lucro real por venda</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden>❌</span>
                <span>Seus custos estão espalhados em papéis e memória</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden>❌</span>
                <span>No fim do mês, você não sabe se ganhou ou perdeu</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-emerald-950">Como funciona</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            <li className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
              <p className="text-sm font-semibold text-emerald-800">Passo 1</p>
              <p className="mt-2 text-base text-neutral-800">Registre a venda em 30 segundos</p>
            </li>
            <li className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
              <p className="text-sm font-semibold text-emerald-800">Passo 2</p>
              <p className="mt-2 text-base text-neutral-800">O sistema calcula arrobas e valor automaticamente</p>
            </li>
            <li className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
              <p className="text-sm font-semibold text-emerald-800">Passo 3</p>
              <p className="mt-2 text-base text-neutral-800">Veja seu lucro real no painel</p>
            </li>
          </ol>
        </section>

        <section id="preco" className="bg-emerald-950 py-16 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold sm:text-3xl">Preço simples</h2>
            <p className="mt-2 text-emerald-100">Plano único — R$ 39/mês</p>
            <ul className="mt-8 grid gap-3 text-emerald-50 sm:grid-cols-2">
              <li>✓ Vendas ilimitadas</li>
              <li>✓ Controle de custos</li>
              <li>✓ Painel completo</li>
              <li>✓ Histórico total</li>
              <li>✓ Relatórios mensais</li>
              <li>✓ Cálculo automático de arroba</li>
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              {stripeHref ? (
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-white text-lg text-emerald-900 hover:bg-emerald-100 sm:w-auto"
                >
                  <a href={stripeHref} target="_blank" rel="noopener noreferrer">
                    Começar com 7 dias grátis
                  </a>
                </Button>
              ) : null}
            </div>
            <p className="mt-6 max-w-xl text-sm text-emerald-100/90">
              Garantia: se não gostar nos primeiros 7 dias, devolvemos seu dinheiro.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-600">
        Pecuária Pro © 2026 | Para quem cria gado de verdade.
      </footer>
    </div>
  );
}

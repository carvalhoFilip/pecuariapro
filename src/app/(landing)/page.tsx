import Link from "next/link";
import { ArrowRight, Beef, CheckCircle, XCircle } from "lucide-react";
import { PreviewCarousel } from "@/components/landing/PreviewCarousel";
import { Button } from "@/components/ui/button";

const hasCheckoutConfig = Boolean(process.env.STRIPE_PRICE_ID?.trim());

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-terra-50 text-terra-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-terra-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-verde-700 text-white">
            <Beef className="h-5 w-5" aria-hidden />
          </span>
          Pecuária Pro
        </Link>
        <Button asChild variant="outline" className="h-11 border-terra-200 text-terra-900 hover:bg-terra-100">
          <Link href="/login">Entrar</Link>
        </Button>
      </header>

      <main>
        <section className="bg-[#1c1917] px-4 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-green-500">Gestão financeira da fazenda</p>
              <h1 className="mb-4 max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Se você não controla sua arroba, você não controla seu lucro.
              </h1>
              <p className="mb-8 max-w-lg text-base leading-relaxed text-gray-400">
                Registre vendas, acompanhe custos e veja seu lucro real — sem planilha, sem complicação.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {hasCheckoutConfig ? (
                  <form action="/api/stripe/checkout" method="POST">
                    <button
                      type="submit"
                      className="inline-block rounded-xl bg-green-600 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-green-700"
                    >
                      Começar 7 dias grátis →
                    </button>
                  </form>
                ) : (
                  <p className="rounded-xl border border-amber-400/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
                    Defina <span className="font-medium">STRIPE_PRICE_ID</span> no ambiente.
                  </p>
                )}
              </div>
              <p className="mt-3 text-xs text-gray-500">Sem cartão de crédito para testar</p>
            </div>
            <div className="hidden sm:block">
              <div className="rounded-2xl border border-white/10 bg-terra-800/40 p-3 shadow-2xl backdrop-blur-sm sm:p-4">
                <PreviewCarousel />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-terra-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-terra-950 sm:text-3xl">Talvez isso esteja te incomodando</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                "Você vende gado mas não sabe o lucro real",
                "Seus custos estão no papel ou na memória",
                "No fim do mês você não sabe se ganhou",
              ].map((t) => (
                <li
                  key={t}
                  className="flex gap-4 rounded-2xl border border-terra-200 bg-terra-50 p-6 shadow-card transition-interactive hover:border-terra-300"
                >
                  <XCircle className="h-6 w-6 shrink-0 text-danger" aria-hidden />
                  <span className="text-base font-medium leading-snug text-terra-800">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-terra-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-terra-950 sm:text-3xl">Como funciona</h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { n: "1", t: "Registre a venda em 30 segundos" },
                { n: "2", t: "O sistema calcula arrobas e valor" },
                { n: "3", t: "Veja seu lucro no painel" },
              ].map((s) => (
                <li key={s.n} className="relative rounded-2xl border border-terra-200 bg-white p-8 shadow-card">
                  <span className="text-4xl font-extrabold text-verde-600">{s.n}</span>
                  <p className="mt-4 text-base font-medium leading-relaxed text-terra-800">{s.t}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="preco" className="border-t border-terra-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-lg px-4 sm:px-8">
            <div className="relative rounded-2xl border-2 border-verde-200 bg-white p-8 shadow-lg sm:p-10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-verde-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Mais popular
              </span>
              <p className="mt-4 text-center text-sm font-medium text-terra-600">Plano único</p>
              <p className="mt-2 text-center">
                <span className="text-5xl font-extrabold tracking-tight text-terra-950">R$ 39</span>
                <span className="text-lg font-medium text-terra-600">/mês</span>
              </p>
              <ul className="mt-8 space-y-3 text-terra-800">
                {[
                  "Vendas ilimitadas",
                  "Controle de custos",
                  "Painel completo",
                  "Histórico total",
                  "Relatórios mensais",
                  "Cálculo automático de arroba",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 shrink-0 text-verde-600" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                {hasCheckoutConfig ? (
                  <form action="/api/stripe/checkout" method="POST">
                    <Button
                      type="submit"
                      className="h-[52px] w-full bg-verde-700 text-base font-semibold hover:bg-verde-800"
                    >
                      Começar com 7 dias grátis
                    </Button>
                  </form>
                ) : null}
              </div>
              <p className="mt-6 text-center text-sm text-terra-500">7 dias grátis · Sem fidelidade · Cancele quando quiser</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-terra-200 py-8 text-center text-sm text-terra-600">
        Pecuária Pro © 2026 · Para quem cria gado de verdade.
      </footer>
    </div>
  );
}

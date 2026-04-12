import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { RecentCustos } from "@/components/dashboard/RecentCustos";
import { getNeonAuthOrNull, getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import {
  type GraficoMes,
  getDashboardPayload,
  mesCorrenteUtc,
  parseMesYYYYMM,
  formatMesReferenciaPt,
} from "@/lib/metrics";
import { formatArrobas, formatBRL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams?: { mes?: string } }) {
  const mes =
    searchParams?.mes && parseMesYYYYMM(searchParams.mes) ? searchParams.mes : mesCorrenteUtc();
  const auth = getNeonAuthOrNull();
  const session = await getSessionUser();

  const podeCarregar =
    Boolean(auth) && Boolean(session.user) && !session.error && isUuidLike(session.user!.id);

  let faturamentoMes = 0;
  let custosMes = 0;
  let lucroMes = 0;
  let arrobasMes = 0;
  let animaisMes = 0;
  let grafico: GraficoMes[] = [];
  let ultimasVendas: Awaited<ReturnType<typeof getDashboardPayload>>["ultimasVendas"] = [];
  let custoRecentes: Awaited<ReturnType<typeof getDashboardPayload>>["custoRecentes"] = [];

  if (podeCarregar && session.user) {
    const user = await ensureAppUser(session.user);
    const d = await getDashboardPayload(user.id, mes);
    faturamentoMes = d.faturamentoMes;
    custosMes = d.custosMes;
    lucroMes = d.lucroMes;
    arrobasMes = d.arrobasMes;
    animaisMes = d.animaisMes;
    grafico = d.grafico;
    ultimasVendas = d.ultimasVendas;
    custoRecentes = d.custoRecentes;
  }

  const subtitulo = `Resumo de ${formatMesReferenciaPt(mes)}`;

  return (
    <>
      <Header titulo="Painel" subtitulo={subtitulo} />
      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-8">
        {!podeCarregar ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Faça login com o Neon Auth ativo para ver seus números reais aqui.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <form method="get" className="flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <label htmlFor="mes" className="text-xs font-medium text-neutral-600">
                Mês
              </label>
              <input
                id="mes"
                name="mes"
                type="month"
                defaultValue={mes}
                className="h-12 min-h-12 rounded-lg border border-neutral-300 bg-white px-3 text-base text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              />
            </div>
            <Button type="submit" className="min-h-12">
              Atualizar
            </Button>
          </form>
          <Button asChild variant="outline" className="min-h-12 w-full sm:w-auto">
            <Link href="/vendas/nova">Adicionar Venda</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard titulo="Faturamento" valor={formatBRL(faturamentoMes)} icone="💰" cor="verde" />
          <MetricCard titulo="Custos" valor={formatBRL(custosMes)} icone="📉" cor="vermelho" />
          <MetricCard titulo="Lucro" valor={formatBRL(lucroMes)} icone="📈" cor="azul" />
          <MetricCard
            titulo="Arrobas"
            valor={`${formatArrobas(arrobasMes)} @`}
            icone="🐂"
            cor="amarelo"
          />
        </div>

        <p className="text-sm text-neutral-600">Animais vendidos no mês: {animaisMes}</p>

        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-950">Receita × custos × lucro</CardTitle>
            <p className="text-sm text-neutral-600">Últimos 6 meses até o mês selecionado.</p>
          </CardHeader>
          <CardContent>
            <RevenueChart dados={grafico} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-950">Últimas vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales vendas={ultimasVendas} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-950">Custos recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentCustos custos={custoRecentes} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

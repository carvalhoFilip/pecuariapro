import { Plus, Receipt, Scale, TrendingUp, Wallet } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { NovaVendaModalButton } from "@/contexts/dashboard-quick-actions";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { RecentCustos } from "@/components/dashboard/RecentCustos";
import { getNeonAuthOrNull, getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { type GraficoMes, getDashboardPayload, mesCorrenteUtc, parseMesYYYYMM } from "@/lib/metrics";
import { formatArrobas, formatBRL, formatDataSemanaLonga, formatMesNomeLowerPt } from "@/lib/format";

export const dynamic = "force-dynamic";

function pctVariacao(atual: number, anterior: number): number | undefined {
  if (!Number.isFinite(anterior) || anterior === 0) return undefined;
  return ((atual - anterior) / anterior) * 100;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const q = await searchParams;
  const mes = q.mes && parseMesYYYYMM(q.mes) ? q.mes : mesCorrenteUtc();
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

  const mesAnterior = grafico.length >= 6 ? grafico[4] : null;
  const varFat = mesAnterior ? pctVariacao(faturamentoMes, mesAnterior.receita) : undefined;
  const varCust = mesAnterior ? pctVariacao(custosMes, mesAnterior.custos) : undefined;
  const varLuc = mesAnterior ? pctVariacao(lucroMes, mesAnterior.lucro) : undefined;
  const nomeMesComparacao = mesAnterior ? formatMesNomeLowerPt(mesAnterior.mes) : undefined;

  const headerDireita = podeCarregar ? (
    <NovaVendaModalButton className="h-10 shrink-0 rounded-lg bg-verde-700 px-4 font-semibold text-white shadow-sm hover:bg-verde-800">
      <Plus className="h-4 w-4" aria-hidden />
      Nova Venda
    </NovaVendaModalButton>
  ) : undefined;

  return (
    <div className="w-full overflow-x-hidden">
      {podeCarregar ? (
        <header className="overflow-x-hidden border-b border-terra-200 bg-terra-50 px-4 py-5 md:px-8">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-terra-950 sm:text-2xl">Painel</h1>
              <p className="mt-1 text-sm text-terra-400">{formatDataSemanaLonga()}</p>
            </div>
            <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end">
              <MonthPicker value={mes} rota="/dashboard" />
              {headerDireita}
            </div>
          </div>
        </header>
      ) : (
        <Header titulo="Painel" />
      )}

      <div className="mx-auto min-h-0 w-full max-w-[1280px] flex-1 bg-[#fafaf9] px-4 py-6 md:px-8 md:py-8">
        {!podeCarregar ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Faça login com o Neon Auth ativo para ver seus números reais aqui.
          </p>
        ) : null}

        {podeCarregar ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 [&>*]:min-w-0">
              <MetricCard
                titulo="Faturamento do mês"
                valor={formatBRL(faturamentoMes)}
                Icon={TrendingUp}
                variant="faturamento"
                variacao={varFat}
                nomeMesComparacao={nomeMesComparacao}
              />
              <MetricCard
                titulo="Custos do mês"
                valor={formatBRL(custosMes)}
                Icon={Receipt}
                variant="custos"
                variacao={varCust}
                nomeMesComparacao={nomeMesComparacao}
              />
              <MetricCard
                titulo="Lucro do mês"
                valor={formatBRL(lucroMes)}
                Icon={Wallet}
                variant="lucro"
                variacao={varLuc}
                nomeMesComparacao={nomeMesComparacao}
                valorLucro={lucroMes}
              />
              <MetricCard
                titulo="Arrobas do mês"
                valor={`${formatArrobas(arrobasMes)} @`}
                Icon={Scale}
                variant="arrobas"
                animaisVendidos={animaisMes}
              />
            </div>

            <RevenueChart dados={grafico} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <RecentSales vendas={ultimasVendas} />
              <RecentCustos custos={custoRecentes} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

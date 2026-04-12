import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { formatBRL, formatDataLonga } from "@/lib/format";
import { CATEGORIAS_CUSTO } from "@/types";
import { getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { getDb } from "@/db";
import { costs, sales } from "@/db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { limitesMesUTC, parseMesYYYYMM, mesCorrenteUtc } from "@/lib/metrics";

export const dynamic = "force-dynamic";

type Linha = {
  id: string;
  tipo: "venda" | "custo";
  data: Date;
  titulo: string;
  detalhe?: string;
  valor: number;
};

function labelCusto(t: string) {
  return CATEGORIAS_CUSTO.find((c) => c.value === t)?.label ?? t;
}

export default async function HistoricoPage({
  searchParams,
}: {
  searchParams?: { mes?: string; inicio?: string; fim?: string };
}) {
  const session = await getSessionUser();
  let linhas: Linha[] = [];
  let aviso: string | null = null;
  const mesParam = searchParams?.mes;
  const inicioParam = searchParams?.inicio;
  const fimParam = searchParams?.fim;

  let inicio: Date | null = null;
  let fim: Date | null = null;

  if (inicioParam && fimParam) {
    inicio = new Date(inicioParam);
    fim = new Date(fimParam);
    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
      aviso = "Datas inválidas. Use o filtro por mês ou um intervalo correto.";
    }
  } else if (mesParam && parseMesYYYYMM(mesParam)) {
    const p = parseMesYYYYMM(mesParam)!;
    const r = limitesMesUTC(p.y, p.m);
    inicio = r.inicio;
    fim = r.fim;
  } else {
    const m = mesCorrenteUtc();
    const p = parseMesYYYYMM(m)!;
    const r = limitesMesUTC(p.y, p.m);
    inicio = r.inicio;
    fim = r.fim;
  }

  if (session.error === "auth_not_configured") {
    aviso = "Configure o Neon Auth para ver o histórico.";
  } else if (!session.user) {
    aviso = "Faça login para ver o histórico.";
  } else if (!isUuidLike(session.user.id)) {
    aviso = "O id da conta precisa ser UUID para bater com o banco.";
  } else if (!aviso && inicio && fim) {
    try {
      const user = await ensureAppUser(session.user);
      const db = getDb();
      const baseVendas = and(eq(sales.userId, user.id), gte(sales.date, inicio), lte(sales.date, fim));
      const baseCustos = and(eq(costs.userId, user.id), gte(costs.date, inicio), lte(costs.date, fim));
      const [vRows, cRows] = await Promise.all([
        db.select().from(sales).where(baseVendas).orderBy(desc(sales.date)),
        db.select().from(costs).where(baseCustos).orderBy(desc(costs.date)),
      ]);
      const vLinhas: Linha[] = vRows.map((v) => ({
        id: v.id,
        tipo: "venda",
        data: new Date(v.date),
        titulo: "Venda de gado",
        detalhe: `${v.quantidadeAnimais} animais · ${Number(v.arrobas).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} @`,
        valor: Number(v.valorTotal),
      }));
      const cLinhas: Linha[] = cRows.map((c) => ({
        id: c.id,
        tipo: "custo",
        data: new Date(c.date),
        titulo: labelCusto(c.tipo),
        detalhe: c.descricao ?? undefined,
        valor: -Number(c.valor),
      }));
      linhas = [...vLinhas, ...cLinhas].sort((a, b) => b.data.getTime() - a.data.getTime());
    } catch {
      aviso = "Não foi possível carregar o histórico.";
    }
  }

  const mesDefault = mesParam && parseMesYYYYMM(mesParam) ? mesParam : mesCorrenteUtc();

  return (
    <>
      <Header titulo="Histórico" subtitulo="Vendas e custos no mesmo lugar, com filtro por mês ou período." />
      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-8">
        {aviso ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{aviso}</p>
        ) : null}

        <form
          method="get"
          className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="mes" className="text-xs font-medium text-neutral-600">
              Mês
            </label>
            <input
              id="mes"
              name="mes"
              type="month"
              defaultValue={mesDefault}
              className="h-12 min-h-12 rounded-lg border border-neutral-300 bg-white px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="inicio" className="text-xs font-medium text-neutral-600">
              Ou início
            </label>
            <input
              id="inicio"
              name="inicio"
              type="date"
              defaultValue={inicioParam ?? ""}
              className="h-12 min-h-12 rounded-lg border border-neutral-300 bg-white px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="fim" className="text-xs font-medium text-neutral-600">
              Fim
            </label>
            <input
              id="fim"
              name="fim"
              type="date"
              defaultValue={fimParam ?? ""}
              className="h-12 min-h-12 rounded-lg border border-neutral-300 bg-white px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
          </div>
          <Button type="submit" className="min-h-12 w-full sm:w-auto">
            Aplicar filtro
          </Button>
          <Button asChild variant="outline" type="button" className="min-h-12 w-full sm:w-auto">
            <Link href="/historico">Mês atual</Link>
          </Button>
        </form>

        <ul className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {linhas.length === 0 ? (
            <li className="px-4 py-10 text-center text-neutral-600">Nada neste período.</li>
          ) : (
            linhas.map((l) => (
              <li key={`${l.tipo}-${l.id}`} className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-emerald-800">
                    {l.tipo === "venda" ? "Venda" : "Custo"}
                  </p>
                  <p className="font-medium text-emerald-950">{formatDataLonga(l.data)}</p>
                  <p className="text-sm text-neutral-700">{l.titulo}</p>
                  {l.detalhe ? <p className="text-sm text-neutral-500">{l.detalhe}</p> : null}
                </div>
                <p
                  className={
                    l.tipo === "venda"
                      ? "text-lg font-semibold text-emerald-800"
                      : "text-lg font-semibold text-red-800"
                  }
                >
                  {l.tipo === "custo" ? <>− {formatBRL(Math.abs(l.valor))}</> : formatBRL(l.valor)}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

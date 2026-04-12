import { HistoricoFiltrosBar } from "@/components/historico/HistoricoFiltrosBar";
import {
  HistoricoTabs,
  type HistoricoCustoRow,
  type HistoricoVendaRow,
} from "@/components/historico/HistoricoTabs";
import { getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { getDb } from "@/db";
import { costs, sales } from "@/db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { limitesMesUTC, parseMesYYYYMM, mesCorrenteUtc } from "@/lib/mes-calculo";

export const dynamic = "force-dynamic";

export default async function HistoricoPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; inicio?: string; fim?: string }>;
}) {
  const session = await getSessionUser();
  let aviso: string | null = null;
  const q = await searchParams;
  const mesParam = q.mes;
  const inicioParam = q.inicio;
  const fimParam = q.fim;

  let inicio: Date | null = null;
  let fim: Date | null = null;

  if (inicioParam && fimParam) {
    const di = new Date(inicioParam);
    const df = new Date(fimParam);
    if (Number.isNaN(di.getTime()) || Number.isNaN(df.getTime())) {
      aviso = "Datas inválidas. Use o filtro por mês ou um intervalo correto.";
      inicio = null;
      fim = null;
    } else {
      inicio = di;
      fim = df;
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

  let modoIntervaloUrl = false;
  if (inicioParam && fimParam && !aviso) {
    const di = new Date(inicioParam);
    const df = new Date(fimParam);
    modoIntervaloUrl = !Number.isNaN(di.getTime()) && !Number.isNaN(df.getTime());
  }

  let vendasLinhas: HistoricoVendaRow[] = [];
  let custosLinhas: HistoricoCustoRow[] = [];
  let totaisVendas = { valor: 0, arrobas: 0, animais: 0 };
  let totaisCustos = { valor: 0, numCategorias: 0 };

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
      vendasLinhas = vRows.map((v) => ({
        id: v.id,
        dataIso: new Date(v.date).toISOString(),
        quantidadeAnimais: v.quantidadeAnimais,
        arrobas: Number(v.arrobas),
        precoArroba: Number(v.precoArroba),
        valorTotal: Number(v.valorTotal),
      }));
      custosLinhas = cRows.map((c) => ({
        id: c.id,
        dataIso: new Date(c.date).toISOString(),
        tipo: c.tipo,
        descricao: c.descricao,
        valor: Number(c.valor),
      }));
      totaisVendas = {
        valor: vRows.reduce((s, v) => s + Number(v.valorTotal), 0),
        arrobas: vRows.reduce((s, v) => s + Number(v.arrobas), 0),
        animais: vRows.reduce((s, v) => s + v.quantidadeAnimais, 0),
      };
      totaisCustos = {
        valor: cRows.reduce((s, c) => s + Number(c.valor), 0),
        numCategorias: new Set(cRows.map((c) => c.tipo)).size,
      };
    } catch {
      aviso = "Não foi possível carregar o histórico.";
    }
  }

  const mesReferencia =
    mesParam && parseMesYYYYMM(mesParam) ? mesParam : mesCorrenteUtc();

  const filtrosKey = `${mesReferencia}-${inicioParam ?? ""}-${fimParam ?? ""}-${modoIntervaloUrl ? "r" : "m"}`;

  const mostrarFiltros =
    session.user &&
    session.error !== "auth_not_configured" &&
    isUuidLike(session.user.id);

  return (
    <div className="mx-auto min-h-0 w-full max-w-[1280px] flex-1 bg-[#fafaf9] px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 border-b border-terra-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-terra-900">Histórico</h1>
        <p className="mt-0.5 text-sm text-terra-400">
          Vendas e custos no mesmo lugar, com filtro por mês ou período.
        </p>
      </div>

      {aviso ? (
        <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{aviso}</p>
      ) : null}

      {mostrarFiltros ? (
        <HistoricoFiltrosBar
          key={filtrosKey}
          mesReferencia={mesReferencia}
          modoIntervaloUrl={modoIntervaloUrl}
          inicioInicial={modoIntervaloUrl ? (inicioParam ?? "") : ""}
          fimInicial={modoIntervaloUrl ? (fimParam ?? "") : ""}
        />
      ) : null}

      {!aviso && inicio && fim && mostrarFiltros ? (
        <HistoricoTabs
          vendas={vendasLinhas}
          custos={custosLinhas}
          totaisVendas={totaisVendas}
          totaisCustos={totaisCustos}
        />
      ) : null}
    </div>
  );
}


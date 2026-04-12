import { and, desc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "@/db";
import { costs, sales } from "@/db/schema";
import { calcularLucro } from "@/types";

export type GraficoMes = {
  mes: string;
  receita: number;
  custos: number;
  lucro: number;
};

export function mesCorrenteUtc(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function parseMesYYYYMM(mes: string): { y: number; m: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(mes);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (mo < 1 || mo > 12) return null;
  return { y, m: mo };
}

export function formatMesReferenciaPt(mes: string): string {
  const p = parseMesYYYYMM(mes);
  if (!p) return mes;
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(p.y, p.m - 1, 1)));
}

export function limitesMesUTC(y: number, m: number): { inicio: Date; fim: Date } {
  const inicio = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const fim = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
  return { inicio, fim };
}

function addMeses(y: number, m: number, delta: number): { y: number; m: number } {
  const idx = y * 12 + (m - 1) + delta;
  return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
}

export async function getDashboardPayload(userId: string, mesRef: string) {
  const ref = parseMesYYYYMM(mesRef);
  if (!ref) {
    throw new Error("mes_invalido");
  }

  const db = getDb();
  const { inicio: inicioRef, fim: fimRef } = limitesMesUTC(ref.y, ref.m);

  const vendasMes = await db
    .select()
    .from(sales)
    .where(and(eq(sales.userId, userId), gte(sales.date, inicioRef), lte(sales.date, fimRef)));

  let faturamentoMes = 0;
  let arrobasMes = 0;
  let animaisMes = 0;
  for (const v of vendasMes) {
    faturamentoMes += Number(v.valorTotal);
    arrobasMes += Number(v.arrobas);
    animaisMes += v.quantidadeAnimais;
  }

  const custosMesRows = await db
    .select()
    .from(costs)
    .where(and(eq(costs.userId, userId), gte(costs.date, inicioRef), lte(costs.date, fimRef)));

  let custosMes = 0;
  for (const c of custosMesRows) {
    custosMes += Number(c.valor);
  }

  const lucroMes = calcularLucro(faturamentoMes, custosMes);

  const grafico: GraficoMes[] = [];
  for (let i = 0; i < 6; i++) {
    const { y, m } = addMeses(ref.y, ref.m, -5 + i);
    const { inicio, fim } = limitesMesUTC(y, m);
    const vs = await db
      .select()
      .from(sales)
      .where(and(eq(sales.userId, userId), gte(sales.date, inicio), lte(sales.date, fim)));
    let receita = 0;
    for (const x of vs) {
      receita += Number(x.valorTotal);
    }
    const cs = await db
      .select()
      .from(costs)
      .where(and(eq(costs.userId, userId), gte(costs.date, inicio), lte(costs.date, fim)));
    let custoSoma = 0;
    for (const x of cs) {
      custoSoma += Number(x.valor);
    }
    grafico.push({
      mes: `${y}-${String(m).padStart(2, "0")}`,
      receita,
      custos: custoSoma,
      lucro: receita - custoSoma,
    });
  }

  const ultimasVendas = await db
    .select()
    .from(sales)
    .where(eq(sales.userId, userId))
    .orderBy(desc(sales.date))
    .limit(5);

  const custoRecentes = await db
    .select()
    .from(costs)
    .where(eq(costs.userId, userId))
    .orderBy(desc(costs.date))
    .limit(5);

  return {
    faturamentoMes,
    custosMes,
    lucroMes,
    arrobasMes,
    animaisMes,
    grafico,
    ultimasVendas,
    custoRecentes,
  };
}

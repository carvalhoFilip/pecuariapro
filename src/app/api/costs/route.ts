import { NextResponse } from "next/server";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "@/db";
import { costs } from "@/db/schema";
import { requireSessionWithUser } from "@/lib/require-session";
import { CATEGORIAS_CUSTO } from "@/types";

export const dynamic = "force-dynamic";

const TIPOS: Set<string> = new Set(CATEGORIAS_CUSTO.map((c) => c.value));

function parseNum(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;
    const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function inicioFimMesYYYYMM(mes: string): { inicio: Date; fim: Date } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(mes);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (mo < 1 || mo > 12) return null;
  const inicio = new Date(Date.UTC(y, mo - 1, 1, 0, 0, 0, 0));
  const fim = new Date(Date.UTC(y, mo, 0, 23, 59, 59, 999));
  return { inicio, fim };
}

export async function GET(request: Request) {
  try {
    const authRes = await requireSessionWithUser();
    if (!authRes.ok) {
      return authRes.response;
    }
    const { user } = authRes.data;
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get("mes");
    const inicioParam = searchParams.get("inicio");
    const fimParam = searchParams.get("fim");

    let inicio: Date | null = null;
    let fim: Date | null = null;

    if (mes) {
      const r = inicioFimMesYYYYMM(mes);
      if (!r) {
        return NextResponse.json({ mensagem: "Parâmetro mes inválido. Use o formato AAAA-MM." }, { status: 400 });
      }
      inicio = r.inicio;
      fim = r.fim;
    } else if (inicioParam && fimParam) {
      inicio = new Date(inicioParam);
      fim = new Date(fimParam);
      if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
        return NextResponse.json({ mensagem: "Datas de início ou fim inválidas." }, { status: 400 });
      }
    }

    const base = eq(costs.userId, user.id);
    const filtro =
      inicio && fim ? and(base, gte(costs.date, inicio), lte(costs.date, fim)) : base;

    const rows = await db.select().from(costs).where(filtro).orderBy(desc(costs.date));

    const porTipo: Record<string, typeof rows> = {};
    for (const c of rows) {
      if (!porTipo[c.tipo]) porTipo[c.tipo] = [];
      porTipo[c.tipo]!.push(c);
    }

    let totalValor = 0;
    for (const r of rows) {
      totalValor += Number(r.valor);
    }

    return NextResponse.json({
      custos: rows,
      porTipo,
      totais: { valorTotal: totalValor, registros: rows.length },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { mensagem: "Não foi possível carregar os custos. Tente de novo em instantes." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const authRes = await requireSessionWithUser();
    if (!authRes.ok) {
      return authRes.response;
    }
    const { user } = authRes.data;
    const body = (await request.json()) as Record<string, unknown>;
    const tipo = typeof body.tipo === "string" ? body.tipo : "";
    const valor = parseNum(body.valor);
    const dateRaw = body.date;
    const descricao = typeof body.descricao === "string" ? body.descricao : null;

    if (!TIPOS.has(tipo)) {
      return NextResponse.json({ mensagem: "Escolha uma categoria de custo válida." }, { status: 400 });
    }
    if (valor === null || valor <= 0) {
      return NextResponse.json({ mensagem: "Informe um valor maior que zero." }, { status: 400 });
    }
    if (!dateRaw) {
      return NextResponse.json({ mensagem: "Informe a data do custo." }, { status: 400 });
    }

    const dataCusto = new Date(String(dateRaw));
    if (Number.isNaN(dataCusto.getTime())) {
      return NextResponse.json({ mensagem: "Data inválida." }, { status: 400 });
    }

    const db = getDb();
    const [created] = await db
      .insert(costs)
      .values({
        userId: user.id,
        tipo,
        valor: valor.toFixed(2),
        date: dataCusto,
        descricao: descricao?.trim() ? descricao.trim() : undefined,
      })
      .returning();

    return NextResponse.json({ custo: created });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { mensagem: "Não foi possível salvar o custo. Confira os dados e tente de novo." },
      { status: 500 },
    );
  }
}

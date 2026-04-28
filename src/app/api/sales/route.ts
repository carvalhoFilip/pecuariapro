import { NextResponse } from "next/server";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "@/db";
import { sales } from "@/db/schema";
import { requireSessionWithUser } from "@/lib/require-session";
import { rateLimit } from "@/lib/rate-limit";
import { calcularArrobas, calcularValorTotal } from "@/types";

export const dynamic = "force-dynamic";

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

    const base = eq(sales.userId, user.id);
    const filtro =
      inicio && fim ? and(base, gte(sales.date, inicio), lte(sales.date, fim)) : base;

    const rows = await db
      .select()
      .from(sales)
      .where(filtro)
      .orderBy(desc(sales.date));

    let totalValor = 0;
    let totalArrobas = 0;
    let totalAnimais = 0;
    for (const r of rows) {
      totalValor += Number(r.valorTotal);
      totalArrobas += Number(r.arrobas);
      totalAnimais += r.quantidadeAnimais;
    }

    return NextResponse.json({
      vendas: rows,
      totais: {
        valorTotal: totalValor,
        arrobas: totalArrobas,
        quantidadeAnimais: totalAnimais,
        registros: rows.length,
      },
    });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("sales.GET error:", e);
    }
    return NextResponse.json(
      { mensagem: "Não foi possível carregar as vendas. Tente de novo em instantes." },
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
    const { success } = rateLimit(`sales:${user.id}`, 30, 60_000);
    if (!success) {
      return new Response("Muitas requisições", { status: 429 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const dateRaw = body.date;
    const quantidadeAnimais = parseNum(body.quantidadeAnimais);
    const pesoBruto = parseNum(body.pesoBruto);
    const pesoLiquido = parseNum(body.pesoLiquido);
    const precoArroba = parseNum(body.precoArroba);
    const observacao = typeof body.observacao === "string" ? body.observacao : null;

    if (
      !dateRaw ||
      quantidadeAnimais === null ||
      pesoBruto === null ||
      pesoLiquido === null ||
      precoArroba === null
    ) {
      return NextResponse.json(
        { mensagem: "Preencha data, quantidade de animais, pesos e preço da arroba." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(quantidadeAnimais) || quantidadeAnimais <= 0) {
      return NextResponse.json({ mensagem: "Quantidade inválida." }, { status: 400 });
    }
    if (!Number.isFinite(pesoBruto) || pesoBruto <= 0) {
      return NextResponse.json({ mensagem: "Peso bruto inválido." }, { status: 400 });
    }
    if (!Number.isFinite(pesoLiquido) || pesoLiquido <= 0) {
      return NextResponse.json({ mensagem: "Peso líquido inválido." }, { status: 400 });
    }
    if (!Number.isFinite(precoArroba) || precoArroba <= 0) {
      return NextResponse.json({ mensagem: "Preço inválido." }, { status: 400 });
    }

    if (!Number.isInteger(quantidadeAnimais)) {
      return NextResponse.json({ mensagem: "Quantidade de animais deve ser inteira." }, { status: 400 });
    }

    if (pesoLiquido >= pesoBruto) {
      return NextResponse.json(
        { mensagem: "O peso líquido precisa ser menor que o peso bruto." },
        { status: 400 },
      );
    }

    const arrobas = calcularArrobas(pesoLiquido);
    const valorTotal = calcularValorTotal(arrobas, precoArroba);

    const dataVenda = new Date(String(dateRaw));
    if (Number.isNaN(dataVenda.getTime())) {
      return NextResponse.json({ mensagem: "Data inválida." }, { status: 400 });
    }

    if (observacao && observacao.length > 500) {
      return NextResponse.json({ mensagem: "Observação muito longa." }, { status: 400 });
    }

    const db = getDb();

    const [created] = await db
      .insert(sales)
      .values({
        userId: user.id,
        date: dataVenda,
        quantidadeAnimais: Math.round(quantidadeAnimais),
        pesoBruto: pesoBruto.toFixed(2),
        pesoLiquido: pesoLiquido.toFixed(2),
        arrobas: arrobas.toFixed(2),
        precoArroba: precoArroba.toFixed(2),
        valorTotal: valorTotal.toFixed(2),
        observacao: observacao ?? undefined,
      })
      .returning();

    return NextResponse.json({ venda: created });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("sales.POST error:", e);
    }
    return NextResponse.json(
      { mensagem: "Não foi possível salvar a venda. Confira os dados e tente de novo." },
      { status: 500 },
    );
  }
}

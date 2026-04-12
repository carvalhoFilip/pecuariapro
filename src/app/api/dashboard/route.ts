import { NextResponse } from "next/server";
import { requireSessionWithUser } from "@/lib/require-session";
import { getDashboardPayload, mesCorrenteUtc, parseMesYYYYMM } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authRes = await requireSessionWithUser();
    if (!authRes.ok) {
      return authRes.response;
    }
    const { user } = authRes.data;
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get("mes") ?? mesCorrenteUtc();
    if (!parseMesYYYYMM(mes)) {
      return NextResponse.json({ mensagem: "Use o parâmetro mes no formato AAAA-MM." }, { status: 400 });
    }
    const payload = await getDashboardPayload(user.id, mes);
    return NextResponse.json(payload);
  } catch (e) {
    if (e instanceof Error && e.message === "mes_invalido") {
      return NextResponse.json({ mensagem: "Mês inválido." }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json(
      { mensagem: "Não foi possível carregar o painel. Tente de novo em instantes." },
      { status: 500 },
    );
  }
}

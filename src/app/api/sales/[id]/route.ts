import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { sales } from "@/db/schema";
import { requireSessionWithUser } from "@/lib/require-session";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function DELETE(_request: Request, { params }: Ctx) {
  try {
    const authRes = await requireSessionWithUser();
    if (!authRes.ok) {
      return authRes.response;
    }
    const { user } = authRes.data;
    const db = getDb();
    const id = params.id;
    const removidos = await db
      .delete(sales)
      .where(and(eq(sales.id, id), eq(sales.userId, user.id)))
      .returning({ id: sales.id });
    if (removidos.length === 0) {
      return NextResponse.json({ mensagem: "Venda não encontrada." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ mensagem: "Não foi possível excluir a venda." }, { status: 500 });
  }
}

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { formatBRL, formatDataLonga } from "@/lib/format";
import { getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { getDb } from "@/db";
import { sales } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ExcluirRegistroButton } from "@/components/ExcluirRegistroButton";

export const dynamic = "force-dynamic";

export default async function VendasPage() {
  const session = await getSessionUser();
  let lista: (typeof sales.$inferSelect)[] = [];
  let aviso: string | null = null;

  if (session.error === "auth_not_configured") {
    aviso = "Configure o Neon Auth para listar vendas reais.";
  } else if (!session.user) {
    aviso = "Faça login para ver suas vendas.";
  } else if (!isUuidLike(session.user.id)) {
    aviso =
      "O id da conta precisa ser UUID para bater com o banco. Ajuste a geração de IDs no Neon Auth (Better Auth).";
  } else {
    try {
      const user = await ensureAppUser(session.user);
      const db = getDb();
      lista = await db
        .select()
        .from(sales)
        .where(eq(sales.userId, user.id))
        .orderBy(desc(sales.date));
    } catch {
      aviso = "Não foi possível carregar o banco de dados.";
    }
  }

  return (
    <>
      <Header titulo="Vendas" subtitulo="Tudo o que você registrou, em um só lugar." />
      <div className="flex flex-1 flex-col gap-4 px-4 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {aviso ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{aviso}</p>
          ) : null}
          <Button asChild className="w-full sm:ml-auto sm:w-auto">
            <Link href="/vendas/nova">Adicionar Venda</Link>
          </Button>
        </div>
        <ul className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {lista.length === 0 ? (
            <li className="px-4 py-10 text-center text-neutral-600">
              Nenhuma venda ainda. Que tal registrar a primeira?
            </li>
          ) : (
            lista.map((v) => (
              <li
                key={v.id}
                className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-emerald-950">{formatDataLonga(new Date(v.date))}</p>
                  <p className="text-sm text-neutral-600">
                    {v.quantidadeAnimais} animais ·{" "}
                    {Number(v.arrobas).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} @
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-emerald-800">{formatBRL(Number(v.valorTotal))}</p>
                  {!aviso ? <ExcluirRegistroButton id={v.id} tipo="venda" /> : null}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

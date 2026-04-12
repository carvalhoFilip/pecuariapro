import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { CATEGORIAS_CUSTO } from "@/types";
import { formatBRL, formatDataLonga } from "@/lib/format";
import { getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { getDb } from "@/db";
import { costs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ExcluirRegistroButton } from "@/components/ExcluirRegistroButton";

export const dynamic = "force-dynamic";

export default async function CustosPage() {
  const session = await getSessionUser();
  let lista: (typeof costs.$inferSelect)[] = [];
  let aviso: string | null = null;

  if (session.error === "auth_not_configured") {
    aviso = "Configure o Neon Auth para listar custos reais.";
  } else if (!session.user) {
    aviso = "Faça login para ver seus custos.";
  } else if (!isUuidLike(session.user.id)) {
    aviso = "O id da conta precisa ser UUID para bater com o banco.";
  } else {
    try {
      const user = await ensureAppUser(session.user);
      const db = getDb();
      lista = await db
        .select()
        .from(costs)
        .where(eq(costs.userId, user.id))
        .orderBy(desc(costs.date));
    } catch {
      aviso = "Não foi possível carregar o banco de dados.";
    }
  }

  const grupos: Record<string, typeof lista> = {};
  for (const c of lista) {
    if (!grupos[c.tipo]) grupos[c.tipo] = [];
    grupos[c.tipo]!.push(c);
  }

  return (
    <>
      <Header titulo="Custos" subtitulo="Organizados por categoria." />
      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {aviso ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{aviso}</p>
          ) : null}
          <Button asChild className="w-full sm:ml-auto sm:w-auto">
            <Link href="/custos/novo">Adicionar custo</Link>
          </Button>
        </div>

        {CATEGORIAS_CUSTO.map((cat) => {
          const itens = grupos[cat.value] ?? [];
          if (itens.length === 0) return null;
          const subtotal = itens.reduce((s, c) => s + Number(c.valor), 0);
          return (
            <section key={cat.value} className="rounded-xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex flex-col gap-1 border-b border-neutral-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-emerald-950">{cat.label}</h2>
                <p className="text-sm font-medium text-neutral-700">Subtotal: {formatBRL(subtotal)}</p>
              </div>
              <ul className="divide-y divide-neutral-100">
                {itens.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-emerald-950">{formatDataLonga(new Date(c.date))}</p>
                      {c.descricao ? <p className="text-sm text-neutral-600">{c.descricao}</p> : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold text-red-800">{formatBRL(Number(c.valor))}</p>
                      {!aviso ? <ExcluirRegistroButton id={c.id} tipo="custo" /> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {lista.length === 0 && !aviso ? (
          <p className="rounded-xl border border-neutral-200 bg-white px-4 py-10 text-center text-neutral-600">
            Nenhum custo ainda. Comece pelo botão acima.
          </p>
        ) : null}
      </div>
    </>
  );
}

import type { LucideIcon } from "lucide-react";
import { Package, Pill, Plus, Receipt, Syringe, Users, Wheat } from "lucide-react";
import { NovoCustoModalButton } from "@/contexts/dashboard-quick-actions";
import { CATEGORIAS_CUSTO } from "@/types";
import { formatBRL, formatDataCurta } from "@/lib/format";
import { getSessionUser } from "@/lib/auth";
import { ensureAppUser } from "@/lib/user";
import { isUuidLike } from "@/lib/user-id";
import { getDb } from "@/db";
import { costs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ExcluirRegistroButton } from "@/components/ExcluirRegistroButton";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const iconPorTipo: Record<string, LucideIcon> = {
  racao: Wheat,
  vacina: Syringe,
  medicamento: Pill,
  funcionarios: Users,
  outros: Package,
};

const iconWrapPorTipo: Record<string, string> = {
  racao: "bg-emerald-100 text-emerald-700",
  vacina: "bg-blue-100 text-blue-700",
  medicamento: "bg-violet-100 text-violet-700",
  funcionarios: "bg-orange-100 text-orange-700",
  outros: "bg-stone-200 text-stone-600",
};

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
    <div className="mx-auto min-h-0 w-full max-w-[1280px] flex-1 bg-[#fafaf9] px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-terra-200 pb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-terra-900">Custos</h1>
          <p className="mt-0.5 text-sm text-terra-400">Organizado por categoria</p>
        </div>
        {aviso ? (
          <p className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:ml-auto sm:max-w-md sm:shrink-0">
            {aviso}
          </p>
        ) : (
          <div className="flex shrink-0">
            <NovoCustoModalButton className="h-10 shrink-0 rounded-lg bg-verde-700 px-4 font-semibold text-white hover:bg-verde-800">
              <Plus className="h-4 w-4" aria-hidden />
              Adicionar custo
            </NovoCustoModalButton>
          </div>
        )}
      </div>

      {!aviso ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {CATEGORIAS_CUSTO.map((cat) => {
            const itens = grupos[cat.value] ?? [];
            if (itens.length === 0) return null;
            const subtotal = itens.reduce((s, c) => s + Number(c.valor), 0);
            const Icon = iconPorTipo[cat.value] ?? Package;
            const wrap = iconWrapPorTipo[cat.value] ?? iconWrapPorTipo.outros;
            return (
              <section
                key={cat.value}
                className="overflow-hidden rounded-2xl border-[1.5px] border-terra-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between gap-3 border-b border-terra-200 bg-terra-50/80 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", wrap)}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h2 className="text-lg font-bold text-terra-900">{cat.label}</h2>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-[#dc2626]">{formatBRL(subtotal)}</p>
                </div>
                <ul className="divide-y divide-terra-100">
                  {itens.map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-sm font-medium text-terra-900">
                          {formatDataCurta(new Date(c.date))}
                        </span>
                        <span className="min-w-0 truncate text-sm text-terra-600">{c.descricao ?? "—"}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-base font-bold tabular-nums text-[#dc2626]">
                          {formatBRL(Number(c.valor))}
                        </span>
                        <ExcluirRegistroButton id={c.id} tipo="custo" />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : null}

      {lista.length === 0 && !aviso ? (
        <div className="overflow-hidden rounded-2xl border-[1.5px] border-terra-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-4 px-5 py-16 text-center">
            <Receipt className="h-12 w-12 text-terra-300" aria-hidden />
            <p className="text-base font-medium text-terra-700">Nenhum custo registrado</p>
            <p className="max-w-md text-sm leading-relaxed text-terra-400">
              Adicione seus custos mensais para calcular o lucro real da fazenda.
            </p>
            <NovoCustoModalButton
              variant="outline"
              className="h-10 rounded-lg border-2 border-verde-600 px-4 text-sm font-semibold text-verde-800 hover:bg-verde-50"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Registrar primeiro custo
            </NovoCustoModalButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

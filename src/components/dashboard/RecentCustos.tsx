import Link from "next/link";
import { ArrowRight, Plus, Receipt } from "lucide-react";
import type { costs } from "@/db/schema";
import { CATEGORIAS_CUSTO } from "@/types";
import { formatBRL, formatDataCurta } from "@/lib/format";
import { ExcluirRegistroButton } from "@/components/ExcluirRegistroButton";
import { NovoCustoModalButton } from "@/contexts/dashboard-quick-actions";
import { cn } from "@/lib/utils";

type Custo = typeof costs.$inferSelect;

function labelTipo(t: string) {
  return CATEGORIAS_CUSTO.find((c) => c.value === t)?.label ?? t;
}

const badgePorTipo: Record<string, string> = {
  racao: "bg-emerald-100 text-emerald-800",
  vacina: "bg-blue-100 text-blue-800",
  medicamento: "bg-violet-100 text-violet-800",
  funcionarios: "bg-orange-100 text-orange-800",
  outros: "bg-stone-200 text-stone-700",
};

type Props = {
  custos: Custo[];
};

export function RecentCustos({ custos }: Props) {
  const count = custos.length;

  return (
    <section className="rounded-2xl border-[1.5px] border-[#e7e5e4] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-terra-950">Custos recentes</h2>
          <p className="mt-1 text-sm text-terra-600">Até 5 registros mais recentes</p>
        </div>
        {count > 0 ? (
          <Link
            href="/custos"
            className="inline-flex items-center gap-1 text-sm font-semibold text-verde-700 transition-interactive hover:text-verde-800"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : null}
      </div>

      <div className="mt-5">
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] px-6 py-12 text-center">
            <Receipt className="h-10 w-10 text-terra-400" aria-hidden />
            <p className="text-sm font-medium text-terra-700">Nenhum custo registrado</p>
            <NovoCustoModalButton
              variant="outline"
              className="h-9 min-h-0 border-verde-600 px-4 text-sm text-verde-800 hover:bg-verde-50"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Registrar primeiro custo
            </NovoCustoModalButton>
          </div>
        ) : (
          <div className="-mx-2 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#f5f5f4]">
                  <th className="bg-[#fafaf9] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-600">
                    Data
                  </th>
                  <th className="bg-[#fafaf9] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-600">
                    Categoria
                  </th>
                  <th className="bg-[#fafaf9] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-600">
                    Descrição
                  </th>
                  <th className="bg-[#fafaf9] px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-terra-600">
                    Valor
                  </th>
                  <th className="w-12 bg-[#fafaf9] px-2 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-600">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {custos.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`group border-b border-[#f5f5f4] transition-interactive hover:bg-[#fafaf9] ${i === custos.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-4 py-3 font-medium text-terra-900">
                      {formatDataCurta(new Date(c.date))}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          badgePorTipo[c.tipo] ?? badgePorTipo.outros,
                        )}
                      >
                        {labelTipo(c.tipo)}
                      </span>
                    </td>
                    <td
                      className="max-w-[200px] truncate px-4 py-3 text-terra-600"
                      title={c.descricao ?? ""}
                    >
                      {c.descricao ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#dc2626] tabular-nums">
                      {formatBRL(Number(c.valor))}
                    </td>
                    <td className="px-1 py-2 text-right opacity-0 transition-opacity group-hover:opacity-100">
                      <ExcluirRegistroButton id={c.id} tipo="custo" iconOnly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

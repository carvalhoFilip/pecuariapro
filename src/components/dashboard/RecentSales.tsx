import Link from "next/link";
import { ArrowRight, Beef, Plus } from "lucide-react";
import type { sales } from "@/db/schema";
import { formatBRL, formatDataCurta } from "@/lib/format";
import { ExcluirRegistroButton } from "@/components/ExcluirRegistroButton";
import { NovaVendaModalButton } from "@/contexts/dashboard-quick-actions";

type Venda = typeof sales.$inferSelect;

type Props = {
  vendas: Venda[];
};

export function RecentSales({ vendas }: Props) {
  const count = vendas.length;

  return (
    <section className="rounded-2xl border-[1.5px] border-[#e7e5e4] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-terra-950">Últimas vendas</h2>
          <p className="mt-1 text-sm text-terra-600">Até 5 registros mais recentes</p>
        </div>
        {count > 0 ? (
          <Link
            href="/vendas"
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
            <Beef className="h-10 w-10 text-terra-400" aria-hidden />
            <p className="text-sm font-medium text-terra-700">Nenhuma venda registrada</p>
            <NovaVendaModalButton
              variant="outline"
              className="h-9 min-h-0 border-verde-600 px-4 text-sm text-verde-800 hover:bg-verde-50"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Adicionar primeira venda
            </NovaVendaModalButton>
          </div>
        ) : (
          <div className="-mx-2 min-w-0 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#f5f5f4]">
                  <th className="bg-[#fafaf9] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-600">
                    Data
                  </th>
                  <th className="bg-[#fafaf9] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-600">
                    Animais
                  </th>
                  <th className="bg-[#fafaf9] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-600">
                    Arrobas
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
                {vendas.map((v, i) => (
                  <tr
                    key={v.id}
                    className={`group border-b border-[#f5f5f4] transition-interactive hover:bg-[#fafaf9] ${i === vendas.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-4 py-3 font-medium text-terra-900">
                      {formatDataCurta(new Date(v.date))}
                    </td>
                    <td className="px-4 py-3 text-terra-900">
                      <span className="font-medium">{v.quantidadeAnimais}</span>{" "}
                      <span className="text-terra-500">cab</span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-terra-900">
                      <span className="font-medium">
                        {Number(v.arrobas).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                      </span>{" "}
                      <span className="text-terra-500">@</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-verde-800 tabular-nums">
                      {formatBRL(Number(v.valorTotal))}
                    </td>
                    <td className="px-1 py-2 text-right opacity-0 transition-opacity group-hover:opacity-100">
                      <ExcluirRegistroButton id={v.id} tipo="venda" iconOnly />
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

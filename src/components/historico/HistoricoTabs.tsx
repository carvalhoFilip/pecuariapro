"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { CATEGORIAS_CUSTO } from "@/types";
import { formatArrobas, formatBRL, formatDataCurta } from "@/lib/format";
import { cn } from "@/lib/utils";

export type HistoricoVendaRow = {
  id: string;
  dataIso: string;
  quantidadeAnimais: number;
  arrobas: number;
  precoArroba: number;
  valorTotal: number;
};

export type HistoricoCustoRow = {
  id: string;
  dataIso: string;
  tipo: string;
  descricao: string | null;
  valor: number;
};

const badgePorTipo: Record<string, string> = {
  racao: "bg-emerald-100 text-emerald-800",
  vacina: "bg-blue-100 text-blue-800",
  medicamento: "bg-violet-100 text-violet-800",
  funcionarios: "bg-orange-100 text-orange-800",
  outros: "bg-stone-200 text-stone-700",
};

function labelCusto(t: string) {
  return CATEGORIAS_CUSTO.find((c) => c.value === t)?.label ?? t;
}

type Props = {
  vendas: HistoricoVendaRow[];
  custos: HistoricoCustoRow[];
  totaisVendas: { valor: number; arrobas: number; animais: number };
  totaisCustos: { valor: number; numCategorias: number };
};

export function HistoricoTabs({ vendas, custos, totaisVendas, totaisCustos }: Props) {
  const [tab, setTab] = useState<"vendas" | "custos">("vendas");

  const nV = vendas.length;
  const nC = custos.length;
  const vazio = tab === "vendas" ? nV === 0 : nC === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("vendas")}
          className={cn(
            "rounded-[20px] px-4 py-1.5 text-sm transition-interactive",
            tab === "vendas"
              ? "border border-verde-300 bg-verde-50 font-semibold text-verde-700"
              : "border border-transparent font-medium text-terra-500 hover:bg-terra-100",
          )}
        >
          Vendas ({nV})
        </button>
        <button
          type="button"
          onClick={() => setTab("custos")}
          className={cn(
            "rounded-[20px] px-4 py-1.5 text-sm transition-interactive",
            tab === "custos"
              ? "border border-verde-300 bg-verde-50 font-semibold text-verde-700"
              : "border border-transparent font-medium text-terra-500 hover:bg-terra-100",
          )}
        >
          Custos ({nC})
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border-[1.5px] border-terra-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {tab === "vendas" ? (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b-[1.5px] border-terra-200 bg-terra-50">
                  <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">Data</th>
                  <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">Animais</th>
                  <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">Arrobas</th>
                  <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">Preço/@</th>
                  <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-terra-500">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {vazio ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                        <History className="h-12 w-12 text-terra-300" aria-hidden />
                        <p className="text-base font-medium text-terra-700">Nada neste período</p>
                        <p className="text-sm leading-relaxed text-terra-400">
                          Tente selecionar outro mês ou adicionar registros.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  vendas.map((v, idx) => (
                    <tr
                      key={v.id}
                      className={cn(
                        "border-b border-terra-100 transition-interactive hover:bg-terra-50",
                        idx === vendas.length - 1 && "border-b-0",
                      )}
                    >
                      <td className="px-5 py-3.5 font-medium text-terra-900">
                        {formatDataCurta(new Date(v.dataIso))}
                      </td>
                      <td className="px-5 py-3.5 text-terra-900">
                        <span className="font-medium">{v.quantidadeAnimais}</span>{" "}
                        <span className="text-xs text-terra-400">cab</span>
                      </td>
                      <td className="px-5 py-3.5 tabular-nums text-terra-900">
                        <span className="font-medium">
                          {v.arrobas.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                        </span>{" "}
                        <span className="text-xs text-terra-400">@</span>
                      </td>
                      <td className="px-5 py-3.5 tabular-nums text-terra-700">{formatBRL(v.precoArroba)}</td>
                      <td className="px-5 py-3.5 text-right text-base font-bold tabular-nums text-verde-700">
                        {formatBRL(v.valorTotal)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {!vazio && tab === "vendas" ? (
                <tfoot>
                  <tr className="border-t-[1.5px] border-terra-200 bg-terra-50">
                    <td colSpan={5} className="px-5 py-3 text-[13px] font-medium text-terra-600">
                      Total: {formatBRL(totaisVendas.valor)} · {formatArrobas(totaisVendas.arrobas)} @ ·{" "}
                      {totaisVendas.animais} {totaisVendas.animais === 1 ? "animal" : "animais"}
                    </td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          ) : (
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b-[1.5px] border-terra-200 bg-terra-50">
                  <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">Data</th>
                  <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">
                    Categoria
                  </th>
                  <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-terra-500">
                    Descrição
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-terra-500">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {nC === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                        <History className="h-12 w-12 text-terra-300" aria-hidden />
                        <p className="text-base font-medium text-terra-700">Nada neste período</p>
                        <p className="text-sm leading-relaxed text-terra-400">
                          Tente selecionar outro mês ou adicionar registros.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  custos.map((c, idx) => (
                    <tr
                      key={c.id}
                      className={cn(
                        "border-b border-terra-100 transition-interactive hover:bg-terra-50",
                        idx === custos.length - 1 && "border-b-0",
                      )}
                    >
                      <td className="px-5 py-3.5 font-medium text-terra-900">
                        {formatDataCurta(new Date(c.dataIso))}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            badgePorTipo[c.tipo] ?? badgePorTipo.outros,
                          )}
                        >
                          {labelCusto(c.tipo)}
                        </span>
                      </td>
                      <td className="max-w-[220px] truncate px-5 py-3.5 text-terra-600" title={c.descricao ?? ""}>
                        {c.descricao ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right text-base font-bold tabular-nums text-[#dc2626]">
                        {formatBRL(c.valor)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {nC > 0 ? (
                <tfoot>
                  <tr className="border-t-[1.5px] border-terra-200 bg-terra-50">
                    <td colSpan={4} className="px-5 py-3 text-[13px] font-medium text-terra-600">
                      Total: {formatBRL(totaisCustos.valor)} · {totaisCustos.numCategorias}{" "}
                      {totaisCustos.numCategorias === 1 ? "categoria" : "categorias"}
                    </td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

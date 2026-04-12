"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LegendPayload } from "recharts";
import { BarChart2, ChevronDown } from "lucide-react";
import type { GraficoMes } from "@/lib/metrics";
import { formatBRL } from "@/lib/format";
import { formatMesReferenciaPt } from "@/lib/mes-calculo";

type Props = {
  dados: GraficoMes[];
};

type LinhaGrafico = GraficoMes & { label: string };

function formatMesLabel(m: string) {
  const [, mo] = m.split("-");
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const idx = Number(mo) - 1;
  return meses[idx] ?? mo;
}

function formatEixoY(v: number): string {
  if (!Number.isFinite(v) || v === 0) return "R$0";
  const abs = Math.abs(v);
  if (abs < 1000) {
    return formatBRL(v).replace(/\u00a0/g, " ");
  }
  const k = v / 1000;
  const rounded = Math.round(k * 10) / 10;
  const str = Number.isInteger(rounded) ? String(Math.trunc(rounded)) : String(rounded).replace(".", ",");
  return `R$${str}k`;
}

function dadosTodosZerados(dados: GraficoMes[]): boolean {
  return dados.every((d) => d.receita === 0 && d.custos === 0 && d.lucro === 0);
}

function TooltipPt({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: LinhaGrafico; name?: string; value?: number; color?: string }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  const tituloMes = formatMesReferenciaPt(row.mes);
  return (
    <div className="rounded-lg border-[1.5px] border-[#e7e5e4] bg-white px-3 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <p className="mb-2 text-xs font-semibold text-terra-900">{tituloMes}</p>
      <ul className="space-y-1.5 text-sm">
        <li className="flex justify-between gap-6">
          <span className="text-[#16a34a]">Receita</span>
          <span className="tabular-nums font-semibold text-terra-900">{formatBRL(row.receita)}</span>
        </li>
        <li className="flex justify-between gap-6">
          <span className="text-[#dc2626]">Custos</span>
          <span className="tabular-nums font-semibold text-terra-900">{formatBRL(row.custos)}</span>
        </li>
        <li className="flex justify-between gap-6">
          <span className="text-[#2563eb]">Lucro</span>
          <span className="tabular-nums font-semibold text-terra-900">{formatBRL(row.lucro)}</span>
        </li>
      </ul>
    </div>
  );
}

function LegendaPills({ payload }: { payload?: readonly LegendPayload[] }) {
  if (!payload?.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {payload.map((item) => (
        <li
          key={String(item.dataKey)}
          className="inline-flex items-center gap-2 rounded-full border border-[#e7e5e4] bg-[#fafaf9] px-3 py-1 text-xs font-medium text-terra-800"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: item.color ?? "#78716c" }}
            aria-hidden
          />
          {item.value}
        </li>
      ))}
    </ul>
  );
}

export function RevenueChart({ dados }: Props) {
  const chartData: LinhaGrafico[] = useMemo(
    () =>
      dados.map((d) => ({
        ...d,
        label: formatMesLabel(d.mes),
      })),
    [dados],
  );

  const vazio = dadosTodosZerados(dados);

  return (
    <div className="rounded-2xl border-[1.5px] border-[#e7e5e4] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-bold tracking-tight text-terra-950">Receita × Custos × Lucro</h3>
          <p className="mt-1 text-sm text-terra-600">Comparativo mensal em reais</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border-[1.5px] border-[#e7e5e4] bg-[#fafaf9] px-3 py-1.5 text-xs font-medium text-terra-700">
          Últimos 6m
          <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </span>
      </div>

      {vazio ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <BarChart2 className="h-10 w-10 text-terra-400" aria-hidden />
          <p className="max-w-sm text-sm text-terra-600">
            Nenhum dado ainda. Adicione sua primeira venda.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-[260px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 4, bottom: 8 }}
              barGap={4}
              barCategoryGap="18%"
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f5f5f4" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#78716c" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#78716c" }}
                tickFormatter={formatEixoY}
                width={56}
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <Tooltip content={<TooltipPt />} cursor={{ fill: "rgba(245,245,244,0.6)" }} />
              <Legend content={(props) => <LegendaPills payload={props.payload} />} />
              <Bar dataKey="receita" name="Receita" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="custos" name="Custos" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="lucro" name="Lucro" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

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
import { formatMesReferenciaPt, parseMesYYYYMM } from "@/lib/mes-calculo";

type Props = {
  dados: GraficoMes[];
};

type LinhaGrafico = GraficoMes & { label: string; hasData: boolean };

type PontoGrafico = {
  mes: string;
  label: string;
  hasData: boolean;
  receita: number | null;
  custos: number | null;
  lucro: number | null;
};

function formatMesLabel(m: string) {
  const [, mo] = m.split("-");
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const idx = Number(mo) - 1;
  return meses[idx] ?? mo;
}

function dadosTodosZerados(dados: Pick<GraficoMes, "receita" | "custos" | "lucro">[]): boolean {
  return dados.every((d) => d.receita === 0 && d.custos === 0 && d.lucro === 0);
}

function TooltipPt({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: PontoGrafico; name?: string; value?: number; color?: string }[];
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
          <span className="tabular-nums font-semibold text-terra-900">{formatBRL(row.receita ?? 0)}</span>
        </li>
        <li className="flex justify-between gap-6">
          <span className="text-[#dc2626]">Custos</span>
          <span className="tabular-nums font-semibold text-terra-900">{formatBRL(row.custos ?? 0)}</span>
        </li>
        <li className="flex justify-between gap-6">
          <span className="text-[#2563eb]">Lucro</span>
          <span className="tabular-nums font-semibold text-terra-900">{formatBRL(row.lucro ?? 0)}</span>
        </li>
      </ul>
    </div>
  );
}

const COR_POR_DATAKEY: Record<string, string> = {
  receita: "#16a34a",
  custos: "#dc2626",
  lucro: "#2563eb",
};

function LegendaPills({ payload }: { payload?: readonly LegendPayload[] }) {
  if (!payload?.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {payload.map((item) => {
        const key = String(item.dataKey ?? "");
        const cor = COR_POR_DATAKEY[key] || item.color || "#78716c";
        return (
          <li
            key={key}
            className="inline-flex items-center gap-2 rounded-full border border-[#e7e5e4] bg-[#fafaf9] px-3 py-1 text-xs font-medium text-terra-800"
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cor }} aria-hidden />
            {item.value}
          </li>
        );
      })}
    </ul>
  );
}

export function RevenueChart({ dados }: Props) {
  const mesesCompletos: LinhaGrafico[] = useMemo(() => {
    const porMes = new Map(dados.map((d) => [d.mes, d]));
    const sorted = [...dados].sort((a, b) => a.mes.localeCompare(b.mes));
    const ultimoMes = sorted.length > 0 ? sorted[sorted.length - 1].mes : null;
    const ref = ultimoMes ? parseMesYYYYMM(ultimoMes) : null;

    let keys: string[];
    if (ref) {
      keys = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(ref.y, ref.m - 1 + (-5 + i), 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      });
    } else {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      keys = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(y, m - (5 - i), 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      });
    }

    return keys.map((key) => {
      const found = porMes.get(key);
      return {
        mes: key,
        label: formatMesLabel(key),
        receita: found?.receita ?? 0,
        custos: found?.custos ?? 0,
        lucro: found?.lucro ?? 0,
        hasData: (found?.receita ?? 0) > 0,
      };
    });
  }, [dados]);

  const dadosGrafico: PontoGrafico[] = useMemo(
    () =>
      mesesCompletos.map((d) =>
        d.hasData
          ? {
              mes: d.mes,
              label: d.label,
              hasData: d.hasData,
              receita: d.receita,
              custos: d.custos,
              lucro: d.lucro,
            }
          : {
              mes: d.mes,
              label: d.label,
              hasData: d.hasData,
              receita: null,
              custos: null,
              lucro: null,
            },
      ),
    [mesesCompletos],
  );

  const vazio = dadosTodosZerados(mesesCompletos);

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
        <div className="mt-6 h-[260px] w-full min-w-[280px] max-w-full">
          <ResponsiveContainer width="100%" height={260} minWidth={280}>
            <BarChart
              data={dadosGrafico}
              margin={{ top: 8, right: 8, left: 4, bottom: 8 }}
              barGap={4}
              barCategoryGap="18%"
            >
              <CartesianGrid vertical={false} stroke="#f5f5f4" strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#78716c" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => (v === 0 ? "R$0" : `R$${(v / 1000).toFixed(0)}k`)}
                tick={{ fontSize: 11, fill: "#78716c" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<TooltipPt />} cursor={{ fill: "rgba(245,245,244,0.6)" }} />
              <Legend content={(props) => <LegendaPills payload={props.payload} />} />
              <Bar
                dataKey="receita"
                name="Receita"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
                barSize={14}
                isAnimationActive={false}
              />
              <Bar
                dataKey="custos"
                name="Custos"
                fill="#dc2626"
                radius={[4, 4, 0, 0]}
                barSize={14}
                isAnimationActive={false}
              />
              <Bar
                dataKey="lucro"
                name="Lucro"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                barSize={14}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

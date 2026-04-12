"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GraficoMes } from "@/lib/metrics";
import { formatBRL } from "@/lib/format";

type Props = {
  dados: GraficoMes[];
};

function formatMesLabel(m: string) {
  const [y, mo] = m.split("-");
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const idx = Number(mo) - 1;
  return `${meses[idx] ?? mo}/${y?.slice(2) ?? ""}`;
}

export function RevenueChart({ dados }: Props) {
  const chartData = dados.map((d) => ({
    ...d,
    label: formatMesLabel(d.mes),
  }));

  return (
    <div className="h-[260px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} width={48} />
          <Tooltip
            formatter={(value) => formatBRL(Number(value))}
            labelFormatter={(_, p) => {
              const mes = p?.[0]?.payload?.mes as string | undefined;
              return mes ? `Mês ${mes}` : "";
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="receita" name="Receita" stroke="#15803d" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="custos" name="Custos" stroke="#b91c1c" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="lucro" name="Lucro" stroke="#1d4ed8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

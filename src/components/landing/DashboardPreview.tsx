"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import type { LucideIcon } from "lucide-react";
import { Receipt, Scale, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const DADOS_FAKE = {
  mes: "Abril 2026",
  faturamento: 142_300,
  custos: 28_400,
  lucro: 113_900,
  arrobas: 847,
  animais: 320,
  grafico: [
    { mes: "Nov", receita: 98_000, custos: 22_000 },
    { mes: "Dez", receita: 124_000, custos: 31_000 },
    { mes: "Jan", receita: 87_000, custos: 19_000 },
    { mes: "Fev", receita: 156_000, custos: 34_000 },
    { mes: "Mar", receita: 112_000, custos: 26_000 },
    { mes: "Abr", receita: 142_300, custos: 28_400 },
  ],
} as const;

function brlInt(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);
}

type MiniMetricProps = {
  label: string;
  valor: string;
  Icon: LucideIcon;
  iconBox: string;
  iconColor: string;
  valorClass: string;
  footer?: string;
  borderLeft?: string;
};

function MiniMetricCard({ label, valor, Icon, iconBox, iconColor, valorClass, footer, borderLeft }: MiniMetricProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-[1.5px] border-terra-200 bg-white px-3 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
        borderLeft,
      )}
    >
      <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBox)}>
        <Icon className={cn("h-4 w-4", iconColor)} strokeWidth={1.75} aria-hidden />
      </span>
      <p className="mt-2 text-[9px] font-medium uppercase tracking-wide text-terra-600">{label}</p>
      <p className={cn("mt-0.5 text-lg font-extrabold tabular-nums leading-tight tracking-tight", valorClass)}>{valor}</p>
      {footer ? <p className="mt-2 border-t border-terra-100 pt-2 text-[10px] text-terra-600">{footer}</p> : null}
    </div>
  );
}

export function Slide1Dashboard() {
  return (
    <div
      style={{
        width: "100%",
        flexShrink: 0,
        height: "100%",
        overflow: "hidden",
        padding: 12,
        boxSizing: "border-box",
      }}
    >
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-terra-200 pb-2">
          <h3 className="text-sm font-bold text-terra-950">Painel</h3>
          <span className="rounded-lg border border-terra-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-terra-700">
            {DADOS_FAKE.mes}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <MiniMetricCard
            label="Faturamento"
            valor={brlInt(DADOS_FAKE.faturamento)}
            Icon={TrendingUp}
            iconBox="bg-[#dcfce7]"
            iconColor="text-[#16a34a]"
            valorClass="text-[#14532d]"
            footer="↑ 14,8% vs março"
          />
          <MiniMetricCard
            label="Custos"
            valor={brlInt(DADOS_FAKE.custos)}
            Icon={Receipt}
            iconBox="bg-[#fee2e2]"
            iconColor="text-[#dc2626]"
            valorClass="text-[#991b1b]"
            footer="↓ 8,2% vs março"
          />
          <MiniMetricCard
            label="Lucro"
            valor={brlInt(DADOS_FAKE.lucro)}
            Icon={Wallet}
            iconBox="bg-[#dbeafe]"
            iconColor="text-[#2563eb]"
            valorClass="text-[#1e3a8a]"
            footer="↑ 32,4% vs março"
            borderLeft="border-l-[3px] border-l-[#16a34a]"
          />
          <MiniMetricCard
            label="Arrobas"
            valor={`${DADOS_FAKE.arrobas.toLocaleString("pt-BR")} @`}
            Icon={Scale}
            iconBox="bg-[#fef3c7]"
            iconColor="text-[#d97706]"
            valorClass="text-terra-900"
            footer={`${DADOS_FAKE.animais} animais vendidos`}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-terra-200 bg-white px-2 pb-2 pt-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="mb-1 px-1 text-[10px] font-bold text-terra-800">Receita × Custos</p>
          <div className="h-[140px] w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={[...DADOS_FAKE.grafico]}
                margin={{ top: 6, right: 4, left: 4, bottom: 0 }}
                barCategoryGap="18%"
                barGap={4}
              >
                <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#78716c" }} axisLine={false} tickLine={false} interval={0} />
                <Bar dataKey="receita" fill="#16a34a" radius={[3, 3, 0, 0]} barSize={8} isAnimationActive={false} />
                <Bar dataKey="custos" fill="#dc2626" radius={[3, 3, 0, 0]} barSize={8} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

export function DashboardPreview() {
  return <Slide1Dashboard />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import type { LucideIcon } from "lucide-react";
import {
  History,
  LayoutDashboard,
  Receipt,
  Scale,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DADOS_FAKE = {
  mes: "Abril 2026",
  faturamento: 142_300,
  custos: 28_400,
  lucro: 113_900,
  arrobas: 847,
  animais: 320,
  grafico: [
    { mes: "Nov", receita: 98_000, custos: 22_000, lucro: 76_000 },
    { mes: "Dez", receita: 124_000, custos: 31_000, lucro: 93_000 },
    { mes: "Jan", receita: 87_000, custos: 19_000, lucro: 68_000 },
    { mes: "Fev", receita: 156_000, custos: 34_000, lucro: 122_000 },
    { mes: "Mar", receita: 112_000, custos: 26_000, lucro: 86_000 },
    { mes: "Abr", receita: 142_300, custos: 28_400, lucro: 113_900 },
  ],
  ultimasVendas: [
    { data: "08 abr", animais: 42, arrobas: 634, valor: 95_100 },
    { data: "03 abr", animais: 28, arrobas: 213, valor: 47_230 },
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

function MiniMetricCard({
  label,
  valor,
  Icon,
  iconBox,
  iconColor,
  valorClass,
  footer,
  borderLeft,
}: MiniMetricProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-[1.5px] border-terra-200 bg-white px-3 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
        borderLeft,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", iconBox)}>
          <Icon className={cn("h-4 w-4", iconColor)} strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-[9px] font-medium uppercase tracking-wide text-terra-600">{label}</p>
      <p className={cn("mt-0.5 text-lg font-extrabold tabular-nums leading-tight tracking-tight", valorClass)}>
        {valor}
      </p>
      {footer ? <p className="mt-2 border-t border-terra-100 pt-2 text-[10px] text-terra-600">{footer}</p> : null}
    </div>
  );
}

export function DashboardPreview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "[perspective:1000px] transition-[opacity,transform] duration-[600ms] ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      <div className="group/preview relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_rotateY(-3deg)_scale(1.02)]">
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/preview:opacity-100"
          style={{
            background:
              "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.35) 45%, transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="relative overflow-hidden rounded-2xl border border-terra-200 bg-[#fafaf9] shadow-[0_20px_60px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.08)]"
          style={{ maxWidth: 780, margin: "0 auto" }}
        >
          {/* Barra tipo janela */}
          <div className="flex h-9 shrink-0 items-center gap-2 border-b border-terra-200 bg-[#f1efea] px-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
            </span>
            <div className="min-w-0 flex-1 truncate rounded-md bg-white/80 px-2 py-0.5 text-center text-[11px] text-terra-400">
              pecuariapro.com.br/dashboard
            </div>
          </div>

          <div className="pointer-events-none flex min-h-0">
            {/* Sidebar fake */}
            <aside
              className="flex w-12 shrink-0 flex-col items-center gap-3 border-r border-terra-800 bg-terra-950 py-3"
              aria-hidden
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-verde-700 text-white">
                <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <TrendingUp className="h-4 w-4 text-terra-500" strokeWidth={1.75} />
              <Wallet className="h-4 w-4 text-terra-500" strokeWidth={1.75} />
              <History className="h-4 w-4 text-terra-500" strokeWidth={1.75} />
            </aside>

            {/* Conteúdo */}
            <div className="min-w-0 flex-1 space-y-3 overflow-hidden p-4 sm:p-5">
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
                <div className="h-[120px] min-h-[120px] w-full min-w-0 sm:min-w-[240px]">
                  <ResponsiveContainer width="100%" height={120} minHeight={120}>
                    <BarChart
                      data={[...DADOS_FAKE.grafico]}
                      margin={{ top: 6, right: 4, left: 4, bottom: 0 }}
                      barCategoryGap="18%"
                      barGap={4}
                    >
                      <XAxis
                        dataKey="mes"
                        tick={{ fontSize: 9, fill: "#78716c" }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                      />
                      <Bar
                        dataKey="receita"
                        name="Receita"
                        fill="#16a34a"
                        radius={[3, 3, 0, 0]}
                        barSize={8}
                        isAnimationActive={false}
                      />
                      <Bar
                        dataKey="custos"
                        name="Custos"
                        fill="#dc2626"
                        radius={[3, 3, 0, 0]}
                        barSize={8}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-terra-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <p className="border-b border-terra-100 px-3 py-2 text-[11px] font-bold text-terra-900">
                  Últimas vendas
                </p>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="text-[9px] font-medium uppercase tracking-wide text-terra-500">
                      <th className="px-3 py-1.5">Data</th>
                      <th className="px-2 py-1.5">Animais</th>
                      <th className="px-2 py-1.5">Arrobas</th>
                      <th className="px-3 py-1.5 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DADOS_FAKE.ultimasVendas.map((v, i) => (
                      <tr
                        key={v.data}
                        className={cn(i < DADOS_FAKE.ultimasVendas.length - 1 && "border-b border-terra-100")}
                      >
                        <td className="px-3 py-1.5 font-medium text-terra-800">{v.data}</td>
                        <td className="px-2 py-1.5 tabular-nums text-terra-700">{v.animais}</td>
                        <td className="px-2 py-1.5 tabular-nums text-terra-700">{v.arrobas}</td>
                        <td className="px-3 py-1.5 text-right font-semibold tabular-nums text-[#14532d]">
                          {brlInt(v.valor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

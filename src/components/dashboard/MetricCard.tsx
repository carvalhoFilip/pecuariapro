import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  titulo: string;
  valor: string;
  Icon: LucideIcon;
  variacao?: number;
  variant?: "faturamento" | "custos" | "lucro" | "arrobas";
  /** Nome do mês já em pt (minúsculas), ex. "março" */
  nomeMesComparacao?: string;
  /** Valor numérico do lucro (para borda esquerda positiva/negativa) */
  valorLucro?: number;
  /** Exibido no rodapé do card de arrobas */
  animaisVendidos?: number;
}

const iconBox: Record<NonNullable<MetricCardProps["variant"]>, { box: string; icon: string }> = {
  faturamento: { box: "bg-[#dcfce7]", icon: "text-[#16a34a]" },
  custos: { box: "bg-[#fee2e2]", icon: "text-[#dc2626]" },
  lucro: { box: "bg-[#dbeafe]", icon: "text-[#2563eb]" },
  arrobas: { box: "bg-[#fef3c7]", icon: "text-[#d97706]" },
};

function corVariacao(
  variant: NonNullable<MetricCardProps["variant"]>,
  variacao: number,
): { cls: string } {
  if (variant === "faturamento" || variant === "lucro") {
    const ok = variacao >= 0;
    return { cls: ok ? "text-[#16a34a]" : "text-[#dc2626]" };
  }
  if (variant === "custos") {
    const ok = variacao <= 0;
    return { cls: ok ? "text-[#16a34a]" : "text-[#dc2626]" };
  }
  return { cls: "text-terra-600" };
}

export function MetricCard({
  titulo,
  valor,
  Icon,
  variacao,
  variant = "faturamento",
  nomeMesComparacao,
  valorLucro,
  animaisVendidos,
}: MetricCardProps) {
  const { box, icon } = iconBox[variant];
  const showVar = variacao !== undefined && Number.isFinite(variacao) && variant !== "arrobas";
  const positive = showVar && variacao >= 0;
  const vsLabel = nomeMesComparacao ?? "mês anterior";
  const varColors = showVar ? corVariacao(variant, variacao!) : null;

  const lucroBorder =
    variant === "lucro" && valorLucro !== undefined && Number.isFinite(valorLucro)
      ? valorLucro >= 0
        ? "border-l-[3px] border-l-[#16a34a]"
        : "border-l-[3px] border-l-[#dc2626]"
      : "";

  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border-[1.5px] border-[#e7e5e4] bg-white px-4 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] sm:px-6",
        lucroBorder,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]",
            box,
          )}
        >
          <Icon className={cn("h-9 w-9", icon)} strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-terra-600">{titulo}</p>
      <p className="mt-1 min-w-0 truncate text-xl font-extrabold tabular-nums leading-none tracking-tight text-terra-900 sm:text-2xl">
        {valor}
      </p>

      <div className="mt-4 border-t border-[#f5f5f4] pt-3">
        {variant === "arrobas" && animaisVendidos !== undefined ? (
          <p className="text-xs text-terra-600">
            {animaisVendidos} {animaisVendidos === 1 ? "animal vendido" : "animais vendidos"}
          </p>
        ) : showVar ? (
          <p className={cn("text-xs tabular-nums text-terra-600", varColors?.cls)}>
            <span className="font-medium">
              {positive ? "↑" : "↓"} {Math.abs(variacao!).toFixed(1)}% vs {vsLabel}
            </span>
          </p>
        ) : (
          <p className="text-xs text-terra-500">—</p>
        )}
      </div>
    </div>
  );
}

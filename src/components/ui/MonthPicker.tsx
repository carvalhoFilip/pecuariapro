"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseMesYYYYMM } from "@/lib/mes-calculo";
import { cn } from "@/lib/utils";

function mesAtualYYYYMMUtc(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function addMesesIso(mes: string, delta: number): string | null {
  const p = parseMesYYYYMM(mes);
  if (!p) return null;
  const idx = p.y * 12 + (p.m - 1) + delta;
  const y = Math.floor(idx / 12);
  const m = (idx % 12) + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

/** Sem Intl — evita mismatch SSR/cliente (ex.: "--------- de ----"). */
const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] as const;

function formatMesCurtoPtStatic(mes: string): string {
  const p = parseMesYYYYMM(mes);
  if (!p) return "—";
  return `${MESES_CURTOS[p.m - 1]} ${p.y}`;
}

export type MonthPickerProps = {
  value: string;
  /** Caminho com `?mes=` (ex.: `/dashboard`) */
  rota?: string;
  className?: string;
  /** Desabilita navegação (ex.: intervalo de datas ativo no histórico) */
  disabled?: boolean;
};

export function MonthPicker({ value, rota = "/dashboard", className, disabled }: MonthPickerProps) {
  const router = useRouter();
  const atual = mesAtualYYYYMMUtc();
  const podeAnterior = Boolean(parseMesYYYYMM(value)) && !disabled;
  const proximo = addMesesIso(value, 1);
  const podeProximo = Boolean(proximo && proximo <= atual) && !disabled;

  function navegarPara(novoMes: string) {
    if (disabled) return;
    router.push(`${rota}?mes=${encodeURIComponent(novoMes)}`);
    router.refresh();
  }

  const label = formatMesCurtoPtStatic(value);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border-[1.5px] border-[#e7e5e4] bg-white px-1 py-1.5",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      role="group"
      aria-label="Selecionar mês de referência"
    >
      <button
        type="button"
        disabled={!podeAnterior}
        onClick={() => {
          const prev = addMesesIso(value, -1);
          if (prev) navegarPara(prev);
        }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-terra-700 transition-interactive hover:bg-[#f5f5f4] disabled:pointer-events-none disabled:opacity-40"
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>
      <span
        className="min-w-[5.5rem] select-none text-center text-sm font-semibold text-terra-900"
        suppressHydrationWarning
      >
        {label}
      </span>
      <button
        type="button"
        disabled={!podeProximo}
        onClick={() => {
          if (proximo && proximo <= atual) navegarPara(proximo);
        }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-terra-700 transition-interactive hover:bg-[#f5f5f4] disabled:pointer-events-none disabled:opacity-40"
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

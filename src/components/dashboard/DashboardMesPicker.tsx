"use client";

import { formatMesReferenciaPt } from "@/lib/mes-calculo";
import { MesReferenciaInput } from "@/components/filters/MesReferenciaInput";

type Props = {
  mes: string;
};

/** Subtítulo do painel: texto do mês + seletor que aplica na hora. */
export function DashboardMesPicker({ mes }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
      <p className="text-sm text-terra-600 sm:text-base">
        Resumo de{" "}
        <strong className="font-semibold text-terra-900">{formatMesReferenciaPt(mes)}</strong>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-terra-500 sm:text-[11px]">
          Mês
        </span>
        <MesReferenciaInput mes={mes} rota="/dashboard" />
      </div>
    </div>
  );
}

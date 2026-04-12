"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  mesReferencia: string;
  modoIntervaloUrl: boolean;
  inicioInicial: string;
  fimInicial: string;
};

const inputClass =
  "h-9 w-full min-w-0 rounded-lg border-[1.5px] border-terra-200 bg-white px-2 text-sm text-terra-900 transition-interactive focus:border-verde-600 focus:outline-none focus:ring-[3px] focus:ring-[rgba(22,163,74,0.1)]";

export function HistoricoFiltrosBar({
  mesReferencia,
  modoIntervaloUrl,
  inicioInicial,
  fimInicial,
}: Props) {
  const [inicio, setInicio] = useState(inicioInicial);
  const [fim, setFim] = useState(fimInicial);

  useEffect(() => {
    setInicio(inicioInicial);
    setFim(fimInicial);
  }, [inicioInicial, fimInicial]);

  const intervaloDigitado = Boolean(inicio.trim() && fim.trim());
  const monthPickerDisabled = modoIntervaloUrl || intervaloDigitado;

  return (
    <div className="mb-6 border-b border-terra-200 pb-6">
      <div
        className={cn(
          "flex flex-col gap-3",
          "lg:flex-row lg:flex-wrap lg:items-center lg:gap-3",
        )}
      >
        <div className="flex shrink-0 items-center lg:shrink-0">
          <MonthPicker value={mesReferencia} rota="/historico" disabled={monthPickerDisabled} />
        </div>

        <span className="hidden shrink-0 self-center select-none text-sm text-terra-300 lg:block" aria-hidden>
          |
        </span>

        <form
          method="get"
          action="/historico"
          className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3"
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-end gap-3">
            <label className="flex min-w-[140px] flex-1 flex-col gap-1 sm:min-w-[150px] sm:flex-initial sm:max-w-[200px]">
              <span className="text-[11px] font-medium leading-none text-terra-500">Início</span>
              <input
                name="inicio"
                type="date"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex min-w-[140px] flex-1 flex-col gap-1 sm:min-w-[150px] sm:flex-initial sm:max-w-[200px]">
              <span className="text-[11px] font-medium leading-none text-terra-500">Fim</span>
              <input
                name="fim"
                type="date"
                value={fim}
                onChange={(e) => setFim(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Button
              type="submit"
              className="h-9 shrink-0 rounded-lg bg-verde-700 px-4 text-sm font-semibold text-white hover:bg-verde-800"
            >
              Aplicar
            </Button>
            <Button
              asChild
              type="button"
              variant="outline"
              className="h-9 shrink-0 rounded-lg border-[1.5px] border-terra-200 text-sm font-semibold text-terra-700 hover:bg-terra-50"
            >
              <Link href="/historico">Mês atual</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

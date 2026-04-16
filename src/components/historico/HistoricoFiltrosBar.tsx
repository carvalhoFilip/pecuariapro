"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { Button } from "@/components/ui/button";

type Props = {
  mesReferencia: string;
  modoIntervaloUrl: boolean;
  inicioInicial: string;
  fimInicial: string;
};

const inputClass =
  "h-11 w-full min-w-0 rounded-xl border-[1.5px] border-gray-200 bg-white px-3 text-sm text-terra-900 appearance-none [-webkit-appearance:none] [color-scheme:light] focus:border-verde-600 focus:outline-none focus:ring-[3px] focus:ring-[rgba(22,163,74,0.1)]";

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
    <div className="mb-6 w-full min-w-0 overflow-x-hidden border-b border-terra-200 pb-6">
      <div className="flex w-full min-w-0 flex-col gap-3 overflow-x-hidden sm:flex-row sm:items-end sm:gap-4">
        <div className="shrink-0">
          <MonthPicker value={mesReferencia} rota="/historico" disabled={monthPickerDisabled} />
        </div>

        <form
          method="get"
          action="/historico"
          className="flex w-full min-w-0 flex-1 flex-col gap-3 overflow-x-hidden sm:flex-row sm:items-end sm:gap-4"
        >
          <div className="grid w-full min-w-0 grid-cols-2 gap-3 overflow-x-hidden">
            <div className="min-w-0 max-w-full">
              <label htmlFor="historico-inicio" className="mb-1 block text-xs font-medium text-terra-600">
                Início
              </label>
              <div className="w-full overflow-hidden">
                <input
                  id="historico-inicio"
                  name="inicio"
                  type="date"
                  placeholder="dd/mm/aaaa"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="min-w-0 max-w-full">
              <label htmlFor="historico-fim" className="mb-1 block text-xs font-medium text-terra-600">
                Fim
              </label>
              <div className="w-full overflow-hidden">
                <input
                  id="historico-fim"
                  name="fim"
                  type="date"
                  placeholder="dd/mm/aaaa"
                  value={fim}
                  onChange={(e) => setFim(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button
              type="submit"
              className="h-11 shrink-0 rounded-xl bg-verde-700 px-4 text-sm font-semibold text-white hover:bg-verde-800"
            >
              Aplicar
            </Button>
            <Button
              asChild
              type="button"
              variant="outline"
              className="h-11 shrink-0 rounded-xl border-[1.5px] border-terra-200 text-sm font-semibold text-terra-700 hover:bg-terra-50"
            >
              <Link href="/historico">Mês atual</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

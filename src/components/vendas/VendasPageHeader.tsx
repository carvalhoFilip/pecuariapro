"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { NovaVendaModalButton } from "@/contexts/dashboard-quick-actions";
import { cn } from "@/lib/utils";

type Props = {
  subtitulo: string;
  /** Cor do subtítulo: vazio/zero vs com dados */
  subtituloClassName?: string;
  mesPickerValue: string;
  mostrarLinkTodas: boolean;
};

export function VendasPageHeader({ subtitulo, subtituloClassName, mesPickerValue, mostrarLinkTodas }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-terra-200 pb-6 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-terra-900">Vendas</h1>
        <p className={cn("mt-0.5 text-sm", subtituloClassName ?? "text-terra-400")}>{subtitulo}</p>
      </div>
      <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-start">
        <div className="flex min-w-0 items-center gap-3">
          <MonthPicker value={mesPickerValue} rota="/vendas" />
          {mostrarLinkTodas ? (
            <Link
              href="/vendas"
              className="text-sm font-semibold text-verde-700 transition-interactive hover:text-verde-800"
            >
              Ver todas
            </Link>
          ) : null}
        </div>
        <NovaVendaModalButton className="h-10 shrink-0 rounded-lg bg-verde-700 px-4 font-semibold text-white hover:bg-verde-800">
          <Plus className="h-4 w-4" aria-hidden />
          Adicionar Venda
        </NovaVendaModalButton>
      </div>
    </div>
  );
}

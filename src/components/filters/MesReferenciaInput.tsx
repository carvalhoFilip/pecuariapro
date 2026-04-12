"use client";

import { useRouter } from "next/navigation";

type Props = {
  /** Valor atual `YYYY-MM`; vazio = sem mês selecionado */
  mes: string | null | undefined;
  /** Caminho da página (ex.: `/dashboard`, `/historico`, `/vendas`) */
  rota: string;
  className?: string;
  /** Se true, esvaziar o campo navega só para `rota` (remove `?mes=`) */
  limparQuandoVazio?: boolean;
};

/**
 * `input type="month"` controlado: ao mudar, navega com `?mes=` (substitui query atual).
 */
export function MesReferenciaInput({ mes, rota, className, limparQuandoVazio = false }: Props) {
  const router = useRouter();
  const valor = mes ?? "";

  return (
    <input
      type="month"
      value={valor}
      onChange={(e) => {
        const v = e.target.value;
        if (!v) {
          if (limparQuandoVazio) {
            router.push(rota);
            router.refresh();
          }
          return;
        }
        router.push(`${rota}?mes=${encodeURIComponent(v)}`);
        router.refresh();
      }}
      aria-label="Alterar mês de referência"
      className={
        className ??
        "h-11 min-h-[48px] cursor-pointer rounded-full border border-terra-200 bg-white px-4 text-sm font-medium text-terra-900 shadow-sm transition-interactive focus:border-verde-600 focus:outline-none focus:ring-2 focus:ring-verde-600/20"
      }
    />
  );
}

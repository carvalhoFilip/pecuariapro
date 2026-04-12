import type { ReactNode } from "react";

type HeaderProps = {
  titulo: string;
  subtitulo?: ReactNode;
  /** Conteúdo à direita (ex.: CTA) */
  direita?: ReactNode;
};

export function Header({ titulo, subtitulo, direita }: HeaderProps) {
  return (
    <header className="flex min-h-16 flex-col gap-3 border-b border-terra-200 bg-terra-50 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-8">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold tracking-tight text-terra-950 sm:text-2xl">{titulo}</h1>
        {subtitulo ? <div className="mt-1">{subtitulo}</div> : null}
      </div>
      {direita ? <div className="flex shrink-0 flex-wrap items-center gap-3">{direita}</div> : null}
    </header>
  );
}

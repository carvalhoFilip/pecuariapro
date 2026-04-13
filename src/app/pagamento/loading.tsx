import { Loader2 } from "lucide-react";

export default function PagamentoLoading() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center overflow-x-hidden overscroll-y-none bg-terra-50 px-4 py-6 sm:py-8">
      <div
        className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-4 rounded-2xl border border-terra-200 bg-white p-10 shadow-card"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2 className="h-10 w-10 shrink-0 animate-spin text-verde-600" aria-hidden />
        <p className="text-center text-sm font-medium text-terra-600">Carregando acesso ao Pecuária Pro…</p>
      </div>
    </div>
  );
}

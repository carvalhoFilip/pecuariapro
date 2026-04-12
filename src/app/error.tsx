"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-terra-900">Algo deu errado</h1>
      <p className="max-w-md text-sm text-terra-600">
        {error.message || "Ocorreu um erro inesperado. Tente de novo ou atualize a página."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-verde-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-verde-800"
      >
        Tentar novamente
      </button>
    </div>
  );
}

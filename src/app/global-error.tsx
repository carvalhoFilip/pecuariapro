"use client";

/** Limite do App Router: precisa de `<html>` e `<body>`. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-terra-50 px-4 py-16 font-sans text-terra-950 antialiased">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-bold">Erro crítico</h1>
          <p className="text-sm text-terra-600">
            {error.message || "Não foi possível carregar a aplicação. Limpe a pasta .next e reinicie o servidor de desenvolvimento."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-verde-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-verde-800"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}

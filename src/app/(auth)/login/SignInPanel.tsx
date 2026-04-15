"use client";

import Link from "next/link";
import { SignInForm, authLocalization } from "@neondatabase/auth/react/ui";
import { Button } from "@/components/ui/button";
import { PagamentoNavLink } from "@/components/navigation/PagamentoNavLink";

export function SignInPanel({ configured }: { configured: boolean }) {
  if (!configured) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Entrar</h1>
        <p className="mt-3 text-base text-neutral-600">
          O login ainda não está ligado: defina <span className="font-medium">NEON_AUTH_BASE_URL</span> e{" "}
          <span className="font-medium">NEON_AUTH_COOKIE_SECRET</span> (mínimo 32 caracteres) no{" "}
          <span className="font-medium">.env.local</span> e reinicie o servidor.
        </p>
        <div className="mt-8">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="mb-6 text-2xl font-bold text-emerald-950">Entrar</h1>
      <SignInForm localization={authLocalization} />
      <p className="mt-6 text-center text-sm text-neutral-600">
        Não tem conta?{" "}
        <PagamentoNavLink
          href="/register?redirect=/pagamento"
          className="font-medium text-emerald-800 underline"
        >
          Criar conta
        </PagamentoNavLink>
      </p>
      <div className="mt-4 text-center">
        <Button asChild variant="ghost" className="text-neutral-600">
          <Link href="/">Página inicial</Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { SignUpForm, authLocalization } from "@neondatabase/auth/react/ui";
import { Button } from "@/components/ui/button";

export function SignUpPanel({
  configured,
  checkoutEmail,
  checkoutOk,
}: {
  configured: boolean;
  checkoutEmail: string | null;
  checkoutOk: boolean;
}) {
  if (!configured) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Criar conta</h1>
        <p className="mt-3 text-base text-neutral-600">
          Configure primeiro <span className="font-medium">NEON_AUTH_BASE_URL</span> e{" "}
          <span className="font-medium">NEON_AUTH_COOKIE_SECRET</span> no <span className="font-medium">.env.local</span>.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/">Página inicial</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      {checkoutOk ? (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Pagamento confirmado. Use o e-mail do checkout para criar a senha:
          <span className="ml-1 font-semibold">{checkoutEmail ?? "o mesmo e-mail usado na Stripe"}</span>
        </div>
      ) : null}
      <h1 className="mb-6 text-2xl font-bold text-emerald-950">Criar conta</h1>
      <SignUpForm localization={authLocalization} />
      <p className="mt-6 text-center text-sm text-neutral-600">
        Já tem conta?{" "}
        <Link href="/login?redirect=/dashboard" className="font-medium text-emerald-800 underline">
          Entrar
        </Link>
      </p>
      <div className="mt-4 text-center">
        <Button asChild variant="ghost" className="text-neutral-600">
          <Link href="/">← Página inicial</Link>
        </Button>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Criar conta | Pecuária Pro",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Criar conta</h1>
        <p className="mt-3 text-base text-neutral-600">
          Em breve você cria a conta direto aqui. Por enquanto, use o teste grátis na página inicial.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/">Ir para a página inicial</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Já tenho conta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

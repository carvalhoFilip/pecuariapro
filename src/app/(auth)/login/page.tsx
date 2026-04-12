import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Entrar | Pecuária Pro",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Entrar</h1>
        <p className="mt-3 text-base text-neutral-600">
          Em produção, o login passa pelo Neon Auth (mesmo banco da sua fazenda). Peça ao desenvolvedor para ativar a
          autenticação no projeto e publicar as telas de entrada.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

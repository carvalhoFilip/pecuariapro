import Link from "next/link";
import type { costs } from "@/db/schema";
import { CATEGORIAS_CUSTO } from "@/types";
import { formatBRL, formatDataLonga } from "@/lib/format";
import { Button } from "@/components/ui/button";

type Custo = typeof costs.$inferSelect;

function labelTipo(t: string) {
  return CATEGORIAS_CUSTO.find((c) => c.value === t)?.label ?? t;
}

type Props = {
  custos: Custo[];
};

export function RecentCustos({ custos }: Props) {
  if (custos.length === 0) {
    return <p className="text-sm text-neutral-600">Nenhum custo registrado ainda.</p>;
  }
  return (
    <div>
      <ul className="divide-y divide-neutral-200">
        {custos.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
            <div>
              <p className="font-medium text-emerald-950">{formatDataLonga(new Date(c.date))}</p>
              <p className="text-sm text-neutral-600">{labelTipo(c.tipo)}</p>
              {c.descricao ? <p className="text-sm text-neutral-500">{c.descricao}</p> : null}
            </div>
            <p className="text-base font-semibold text-red-800">{formatBRL(Number(c.valor))}</p>
          </li>
        ))}
      </ul>
      <div className="pt-4">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/custos">Ver todos os custos</Link>
        </Button>
      </div>
    </div>
  );
}

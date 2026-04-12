import Link from "next/link";
import type { sales } from "@/db/schema";
import { formatBRL, formatDataLonga } from "@/lib/format";
import { Button } from "@/components/ui/button";

type Venda = typeof sales.$inferSelect;

type Props = {
  vendas: Venda[];
};

export function RecentSales({ vendas }: Props) {
  if (vendas.length === 0) {
    return <p className="text-sm text-neutral-600">Nenhuma venda registrada ainda.</p>;
  }
  return (
    <div>
      <ul className="divide-y divide-neutral-200">
        {vendas.map((v) => (
          <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
            <div>
              <p className="font-medium text-emerald-950">{formatDataLonga(new Date(v.date))}</p>
              <p className="text-sm text-neutral-600">
                {v.quantidadeAnimais} animais ·{" "}
                {Number(v.arrobas).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} @
              </p>
            </div>
            <p className="text-base font-semibold text-emerald-800">{formatBRL(Number(v.valorTotal))}</p>
          </li>
        ))}
      </ul>
      <div className="pt-4">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/vendas">Ver todas as vendas</Link>
        </Button>
      </div>
    </div>
  );
}

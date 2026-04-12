import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  titulo: string;
  valor: string;
  icone: string;
  variacao?: number;
  cor?: "verde" | "vermelho" | "amarelo" | "azul";
}

const corMap = {
  verde: "border-emerald-200 bg-emerald-50/80 text-emerald-950",
  vermelho: "border-red-200 bg-red-50/80 text-red-950",
  amarelo: "border-amber-200 bg-amber-50/80 text-amber-950",
  azul: "border-sky-200 bg-sky-50/80 text-sky-950",
};

export function MetricCard({ titulo, valor, icone, variacao, cor = "verde" }: MetricCardProps) {
  return (
    <Card className={cn("border shadow-sm", corMap[cor])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">{titulo}</CardTitle>
        <span className="text-xl" aria-hidden>
          {icone}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{valor}</p>
        {variacao !== undefined && Number.isFinite(variacao) ? (
          <p className="mt-1 text-xs opacity-80">
            {variacao >= 0 ? "▲" : "▼"} {Math.abs(variacao).toFixed(1)}% vs. mês anterior
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

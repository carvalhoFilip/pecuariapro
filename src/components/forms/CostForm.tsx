"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Wheat, Syringe, Pill, Users, Ellipsis } from "lucide-react";
import { CATEGORIAS_CUSTO } from "@/types";
import { formatBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const icones: Record<string, React.ReactNode> = {
  racao: <Wheat className="h-6 w-6" aria-hidden />,
  vacina: <Syringe className="h-6 w-6" aria-hidden />,
  medicamento: <Pill className="h-6 w-6" aria-hidden />,
  funcionarios: <Users className="h-6 w-6" aria-hidden />,
  outros: <Ellipsis className="h-6 w-6" aria-hidden />,
};

function parseDecimalInput(raw: string): number {
  const s = raw.trim();
  if (!s) return 0;
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function hojeInputDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function CostForm() {
  const router = useRouter();
  const [tipo, setTipo] = useState<(typeof CATEGORIAS_CUSTO)[number]["value"]>("racao");
  const [valorStr, setValorStr] = useState("");
  const [date, setDate] = useState(hojeInputDate());
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const valorNum = useMemo(() => parseDecimalInput(valorStr), [valorStr]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (valorNum <= 0) {
      setErro("Informe um valor válido.");
      return;
    }
    setCarregando(true);
    try {
      const res = await fetch("/api/costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tipo,
          valor: valorNum,
          date: new Date(date + "T12:00:00").toISOString(),
          descricao: descricao.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { mensagem?: string };
      if (!res.ok) {
        setErro(data.mensagem ?? "Não foi possível salvar.");
        return;
      }
      router.push("/custos");
      router.refresh();
    } catch {
      setErro("Sem conexão. Verifique a internet e tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-lg flex-col gap-6 pb-28">
      <Card className="border-emerald-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-emerald-900">Adicionar Custo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIAS_CUSTO.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setTipo(c.value)}
                  className={cn(
                    "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-2 text-sm font-medium transition-colors",
                    tipo === c.value
                      ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-emerald-300",
                  )}
                >
                  {icones[c.value]}
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              inputMode="decimal"
              placeholder="Ex.: 1.500,00"
              value={valorStr}
              onChange={(e) => setValorStr(e.target.value)}
              required
            />
            {valorNum > 0 ? (
              <p className="text-sm text-neutral-600">Prévia: {formatBRL(valorNum)}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Observação (opcional)</Label>
            <textarea
              id="desc"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="flex min-h-[96px] w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
          </div>
        </CardContent>
      </Card>

      {erro ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {erro}
        </p>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/95 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <div className="mx-auto flex max-w-lg gap-3">
          <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button type="submit" className="flex-[2] sm:flex-1" disabled={carregando}>
            {carregando ? "Salvando…" : "Salvar custo"}
          </Button>
        </div>
      </div>
    </form>
  );
}

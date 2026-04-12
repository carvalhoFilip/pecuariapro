"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calcularArrobas, calcularValorTotal } from "@/types";
import { formatArrobas, formatBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function SaleForm() {
  const router = useRouter();
  const [date, setDate] = useState(hojeInputDate());
  const [quantidadeAnimais, setQuantidadeAnimais] = useState("");
  const [pesoBruto, setPesoBruto] = useState("");
  const [pesoLiquido, setPesoLiquido] = useState("");
  const [precoArroba, setPrecoArroba] = useState("");
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const qtd = useMemo(() => Math.max(0, Math.round(parseDecimalInput(quantidadeAnimais))), [quantidadeAnimais]);
  const bruto = useMemo(() => parseDecimalInput(pesoBruto), [pesoBruto]);
  const liquido = useMemo(() => parseDecimalInput(pesoLiquido), [pesoLiquido]);
  const preco = useMemo(() => parseDecimalInput(precoArroba), [precoArroba]);

  const arrobas = liquido > 0 ? calcularArrobas(liquido) : 0;
  const valorTotal = liquido > 0 && preco > 0 ? calcularValorTotal(arrobas, preco) : 0;
  const previewValido = liquido > 0 && preco > 0 && bruto > liquido && qtd > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (qtd <= 0) {
      setErro("Informe quantos animais foram vendidos.");
      return;
    }
    if (bruto <= 0 || liquido <= 0 || preco <= 0) {
      setErro("Preencha peso bruto, peso líquido e preço da arroba com valores válidos.");
      return;
    }
    if (liquido >= bruto) {
      setErro("O peso líquido precisa ser menor que o peso bruto.");
      return;
    }

    setCarregando(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          date: new Date(date + "T12:00:00").toISOString(),
          quantidadeAnimais: qtd,
          pesoBruto: bruto,
          pesoLiquido: liquido,
          precoArroba: preco,
          observacao: observacao.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { mensagem?: string };
      if (!res.ok) {
        setErro(data.mensagem ?? "Não foi possível salvar.");
        return;
      }
      router.push("/vendas");
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
          <CardTitle className="text-emerald-900">Adicionar Venda</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="data">Data da venda</Label>
            <Input id="data" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qtd">Quantidade de animais</Label>
            <Input
              id="qtd"
              inputMode="numeric"
              placeholder="Ex.: 42"
              value={quantidadeAnimais}
              onChange={(e) => setQuantidadeAnimais(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bruto">Peso bruto (kg)</Label>
            <Input
              id="bruto"
              inputMode="decimal"
              placeholder="Ex.: 12.450"
              value={pesoBruto}
              onChange={(e) => setPesoBruto(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="liquido">Peso líquido (kg)</Label>
            <Input
              id="liquido"
              inputMode="decimal"
              placeholder="Ex.: 11.200"
              value={pesoLiquido}
              onChange={(e) => setPesoLiquido(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preco">Preço da arroba (R$)</Label>
            <Input
              id="preco"
              inputMode="decimal"
              placeholder="Ex.: 320"
              value={precoArroba}
              onChange={(e) => setPrecoArroba(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="obs">Observação (opcional)</Label>
            <textarea
              id="obs"
              rows={3}
              placeholder="Ex.: comprador, praça, lote..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="flex min-h-[96px] w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-base text-emerald-950">
        {previewValido ? (
          <p>
            Você vai registrar <strong>{formatArrobas(arrobas)} @</strong> no valor de{" "}
            <strong>{formatBRL(valorTotal)}</strong>.
          </p>
        ) : (
          <p className="text-emerald-900/80">
            Enquanto você preenche, mostramos aqui o total de arrobas e o valor da venda.
          </p>
        )}
      </div>

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
            {carregando ? "Salvando…" : "Salvar Venda"}
          </Button>
        </div>
      </div>
    </form>
  );
}

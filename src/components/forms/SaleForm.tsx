"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Calculator, CheckCircle } from "lucide-react";
import { calcularArrobas, calcularValorTotal } from "@/types";
import { formatArrobas, formatBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

const fieldClass =
  "h-12 min-h-[48px] rounded-[10px] border-[1.5px] border-terra-200 bg-white px-4 text-base text-terra-900 shadow-sm transition-interactive placeholder:text-terra-400 focus:border-verde-600 focus:outline-none focus:ring-2 focus:ring-verde-600/20";

const modalInput =
  "h-11 w-full min-w-0 max-w-full rounded-[10px] border-[1.5px] border-terra-200 bg-white px-3 pr-10 text-[15px] text-terra-900 shadow-sm transition-all placeholder:text-terra-400 focus:border-verde-600 focus:outline-none focus:ring-[3px] focus:ring-[rgba(22,163,74,0.1)]";

/** Mesmas classes de `modalInput` (como demais campos) + neutralizar estilo nativo de data no iOS/Android. */
const modalDateInput = cn(modalInput, "appearance-none [-webkit-appearance:none]");

const modalLabel = "mb-1.5 block text-xs font-medium text-terra-700";

export type SaleFormProps = {
  titleless?: boolean;
  onSaved?: () => void;
  onDismiss?: () => void;
};

export function SaleForm({ titleless, onSaved, onDismiss }: SaleFormProps = {}) {
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
  const mediaPorAnimal = previewValido && qtd > 0 ? valorTotal / qtd : 0;

  const pesoLiquidoInvalido = bruto > 0 && liquido > 0 && liquido >= bruto;

  const podeSalvar =
    qtd > 0 && bruto > 0 && liquido > 0 && preco > 0 && liquido < bruto && !carregando;

  const progressFilled = useMemo(() => {
    const d = Boolean(date?.trim());
    const q = qtd > 0;
    const b = bruto > 0;
    const l = liquido > 0 && !pesoLiquidoInvalido;
    const p = preco > 0;
    return [d, q, b, l, p].filter(Boolean).length;
  }, [date, qtd, bruto, liquido, preco, pesoLiquidoInvalido]);

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
      onSaved?.();
      if (!onSaved) {
        router.push("/vendas");
      }
      router.refresh();
    } catch {
      setErro("Sem conexão. Verifique a internet e tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  if (titleless) {
    return (
      <form onSubmit={onSubmit} className="flex w-full min-w-0 max-w-full flex-col gap-5 overflow-x-hidden">
        <div
          className="flex justify-center gap-2 py-0.5"
          aria-label={`${progressFilled} de 5 campos obrigatórios preenchidos`}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn("h-2 w-2 rounded-full transition-colors", i < progressFilled ? "bg-verde-600" : "bg-terra-200")}
            />
          ))}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
          <div className="min-w-0 max-w-full">
            <Label htmlFor="data" className={modalLabel}>
              Data da venda
            </Label>
            <div className="relative min-w-0 max-w-full">
              <input
                id="data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={modalDateInput}
              />
              {date ? (
                <CheckCircle
                  className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-verde-600"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
          <div className="min-w-0 max-w-full">
            <Label htmlFor="qtd" className={modalLabel}>
              Qtd de animais
            </Label>
            <div className="relative min-w-0 max-w-full">
              <Input
                id="qtd"
                inputMode="numeric"
                placeholder="Ex.: 42"
                value={quantidadeAnimais}
                onChange={(e) => setQuantidadeAnimais(e.target.value)}
                required
                className={cn(modalInput, qtd > 0 && "pr-10")}
              />
              {qtd > 0 ? (
                <CheckCircle
                  className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-verde-600"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
          <div className="min-w-0 max-w-full">
            <Label htmlFor="bruto" className={modalLabel}>
              Peso bruto (kg)
            </Label>
            <div className="relative min-w-0 max-w-full">
              <Input
                id="bruto"
                inputMode="decimal"
                placeholder="Ex.: 12.450"
                value={pesoBruto}
                onChange={(e) => setPesoBruto(e.target.value)}
                required
                className={cn(modalInput, bruto > 0 && "pr-10")}
              />
              {bruto > 0 ? (
                <CheckCircle
                  className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-verde-600"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
          <div className="min-w-0 max-w-full">
            <Label htmlFor="liquido" className={modalLabel}>
              Peso líquido (kg)
            </Label>
            <div className="relative min-w-0 max-w-full">
              <Input
                id="liquido"
                inputMode="decimal"
                placeholder="Ex.: 11.200"
                value={pesoLiquido}
                onChange={(e) => setPesoLiquido(e.target.value)}
                required
                className={cn(
                  modalInput,
                  liquido > 0 && !pesoLiquidoInvalido && "pr-10",
                  pesoLiquidoInvalido && "border-danger pr-3 focus:border-danger focus:ring-red-500/15",
                )}
              />
              {liquido > 0 && !pesoLiquidoInvalido ? (
                <CheckCircle
                  className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-verde-600"
                  aria-hidden
                />
              ) : null}
            </div>
            {pesoLiquidoInvalido ? (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger" role="alert">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Peso líquido deve ser menor que o bruto
              </p>
            ) : null}
          </div>
          <div className="min-w-0 max-w-full">
            <Label htmlFor="preco" className={modalLabel}>
              Preço por @ (R$)
            </Label>
            <div className="relative min-w-0 max-w-full">
              <Input
                id="preco"
                inputMode="decimal"
                placeholder="Ex.: 320"
                value={precoArroba}
                onChange={(e) => setPrecoArroba(e.target.value)}
                required
                className={cn(modalInput, preco > 0 && "pr-10")}
              />
              {preco > 0 ? (
                <CheckCircle
                  className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-verde-600"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
          <div className="min-w-0 max-w-full">
            <Label htmlFor="obs" className={modalLabel}>
              Observação <span className="font-normal text-terra-400">(opcional)</span>
            </Label>
            <textarea
              id="obs"
              rows={1}
              placeholder="Ex.: comprador, praça..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className={cn(modalInput, "h-11 min-h-[44px] resize-none py-2.5 leading-snug")}
            />
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden rounded-xl border-[1.5px] p-5 transition-all duration-200",
            previewValido
              ? "translate-y-0 border-[#bbf7d0] bg-[#f0fdf4] opacity-100"
              : "translate-y-0 border-terra-200 bg-terra-50 opacity-100",
          )}
        >
          <p className="text-sm font-semibold text-verde-900">Resumo da venda</p>
          <hr className="my-3 border-verde-200/80" />
          {previewValido ? (
            <div className="grid grid-cols-1 gap-4 divide-y divide-[#bbf7d0] text-center sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-y-0">
              <div className="px-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#16a34a]">Arrobas</p>
                <p className="mt-1.5 text-lg font-bold tabular-nums text-[#14532d]">{formatArrobas(arrobas)} @</p>
              </div>
              <div className="px-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#16a34a]">Valor total</p>
                <p className="mt-1.5 text-lg font-bold tabular-nums text-[#14532d]">{formatBRL(valorTotal)}</p>
              </div>
              <div className="px-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#16a34a]">Por animal</p>
                <p className="mt-1.5 text-lg font-bold tabular-nums text-[#14532d]">{formatBRL(mediaPorAnimal)}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-3 text-center">
              <Calculator className="h-8 w-8 text-terra-300" aria-hidden />
              <p className="text-sm text-terra-600">Preencha os campos para ver o cálculo</p>
            </div>
          )}
        </div>

        {erro ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
            {erro}
          </p>
        ) : null}

        <div className="flex flex-col-reverse items-stretch justify-end gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-12 min-h-12 rounded-[10px] border-[1.5px] border-terra-200 text-terra-600 hover:bg-terra-50 sm:min-w-[120px]"
            onClick={() => (onDismiss ? onDismiss() : router.back())}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!podeSalvar}
            className={cn(
              "h-12 min-h-12 gap-2 rounded-[10px] px-5 font-semibold",
              "bg-verde-700 text-white hover:bg-verde-800",
              "disabled:pointer-events-none disabled:border disabled:border-terra-200 disabled:bg-terra-100 disabled:text-terra-500 disabled:opacity-100 disabled:shadow-none disabled:hover:bg-terra-100",
            )}
          >
            <CheckCircle className="h-5 w-5 shrink-0" aria-hidden />
            Registrar venda →
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "mx-auto flex w-full max-w-[600px] flex-col gap-8",
        "px-4 py-8 sm:px-0",
      )}
    >
      <div className="rounded-2xl border border-terra-200 bg-white p-6 shadow-card sm:p-8">
        <>
          <h1 className="text-2xl font-bold tracking-tight text-terra-950">Nova Venda</h1>
          <p className="mt-1 text-sm text-terra-600">Preencha os dados da venda</p>
        </>

        <div className="mt-8 flex flex-col gap-6">
          <div className="space-y-2">
            <Label htmlFor="data-page" className="text-[13px] font-medium text-terra-800">
              Data da venda
            </Label>
            <Input
              id="data-page"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={cn(fieldClass, "appearance-none [-webkit-appearance:none]")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qtd-page" className="text-[13px] font-medium text-terra-800">
              Quantidade de animais
            </Label>
            <Input
              id="qtd-page"
              inputMode="numeric"
              placeholder="Ex.: 42"
              value={quantidadeAnimais}
              onChange={(e) => setQuantidadeAnimais(e.target.value)}
              required
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bruto-page" className="text-[13px] font-medium text-terra-800">
              Peso bruto (kg)
            </Label>
            <Input
              id="bruto-page"
              inputMode="decimal"
              placeholder="Ex.: 12.450"
              value={pesoBruto}
              onChange={(e) => setPesoBruto(e.target.value)}
              required
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="liquido-page" className="text-[13px] font-medium text-terra-800">
              Peso líquido (kg)
            </Label>
            <Input
              id="liquido-page"
              inputMode="decimal"
              placeholder="Ex.: 11.200"
              value={pesoLiquido}
              onChange={(e) => setPesoLiquido(e.target.value)}
              required
              className={cn(fieldClass, pesoLiquidoInvalido && "border-danger")}
            />
            {pesoLiquidoInvalido ? (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-danger" role="alert">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Peso líquido deve ser menor que o bruto
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="preco-page" className="text-[13px] font-medium text-terra-800">
              Preço por @ (R$)
            </Label>
            <Input
              id="preco-page"
              inputMode="decimal"
              placeholder="Ex.: 320"
              value={precoArroba}
              onChange={(e) => setPrecoArroba(e.target.value)}
              required
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="obs-page" className="text-[13px] font-medium text-terra-800">
              Observação (opcional)
            </Label>
            <textarea
              id="obs-page"
              rows={3}
              placeholder="Ex.: comprador, praça, lote..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className={cn(fieldClass, "min-h-[96px] py-3")}
            />
          </div>
        </div>

        <div
          className={cn(
            "mt-8 rounded-xl border border-verde-200 bg-verde-50 p-5 transition-opacity duration-200",
            previewValido ? "opacity-100" : "opacity-60",
          )}
        >
          <p className="text-sm font-semibold text-verde-900">Resumo da venda</p>
          <hr className="my-3 border-verde-200" />
          {previewValido ? (
            <dl className="space-y-2 text-sm text-terra-800">
              <div className="flex justify-between gap-4">
                <dt>Arrobas calculadas</dt>
                <dd className="tabular-money font-semibold text-terra-900">{formatArrobas(arrobas)} @</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Valor total da venda</dt>
                <dd className="tabular-money font-bold text-verde-800">{formatBRL(valorTotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Média por animal</dt>
                <dd className="tabular-money font-semibold text-terra-900">{formatBRL(mediaPorAnimal)}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-terra-600">Preencha peso líquido, preço e quantidade para ver o resumo.</p>
          )}
        </div>

        {erro ? (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
            {erro}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-[52px] min-h-[52px] border-terra-200"
            onClick={() => (onDismiss ? onDismiss() : router.back())}
          >
            {onDismiss ? "Cancelar" : "Voltar"}
          </Button>
          <Button
            type="submit"
            disabled={!podeSalvar}
            className={cn(
              "h-[52px] min-h-[52px] w-full font-semibold sm:w-auto sm:min-w-[200px]",
              "bg-verde-700 text-white hover:bg-verde-800",
              "disabled:pointer-events-none disabled:border disabled:border-terra-200 disabled:bg-terra-100 disabled:text-terra-500 disabled:opacity-100 disabled:shadow-none disabled:hover:bg-terra-100",
            )}
          >
            <CheckCircle className="h-5 w-5" aria-hidden />
            Salvar venda
          </Button>
        </div>
      </div>
    </form>
  );
}

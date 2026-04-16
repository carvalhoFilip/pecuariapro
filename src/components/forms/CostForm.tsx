"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { CheckCircle, Package, Pill, Syringe, Users, Wheat } from "lucide-react";
import { CATEGORIAS_CUSTO } from "@/types";
import { formatBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  racao: Wheat,
  vacina: Syringe,
  medicamento: Pill,
  funcionarios: Users,
  outros: Package,
};

const iconColorSelected: Record<string, string> = {
  racao: "text-[#16a34a]",
  vacina: "text-[#2563eb]",
  medicamento: "text-[#7c3aed]",
  funcionarios: "text-[#d97706]",
  outros: "text-[#64748b]",
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

const fieldClass =
  "h-12 min-h-[48px] rounded-[10px] border-[1.5px] border-terra-200 bg-white px-4 text-base text-terra-900 shadow-sm transition-interactive placeholder:text-terra-400 focus:border-verde-600 focus:outline-none focus:ring-2 focus:ring-verde-600/20";

const modalField =
  "h-11 w-full rounded-[10px] border-[1.5px] border-terra-200 bg-white px-3 text-[15px] text-terra-900 shadow-sm transition-all placeholder:text-terra-400 focus:border-verde-600 focus:outline-none focus:ring-[3px] focus:ring-[rgba(22,163,74,0.1)]";

const modalLabel = "mb-1.5 block text-xs font-medium text-terra-700";

export type CostFormProps = {
  titleless?: boolean;
  onSaved?: () => void;
  onDismiss?: () => void;
};

export function CostForm({ titleless, onSaved, onDismiss }: CostFormProps = {}) {
  const router = useRouter();
  const [tipo, setTipo] = useState<(typeof CATEGORIAS_CUSTO)[number]["value"]>("racao");
  const [valorStr, setValorStr] = useState("");
  const [date, setDate] = useState(hojeInputDate());
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const valorNum = useMemo(() => parseDecimalInput(valorStr), [valorStr]);
  const podeSalvar = valorNum > 0 && !carregando;

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
      onSaved?.();
      if (!onSaved) {
        router.push("/custos");
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
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="valor-m" className={modalLabel}>
              Valor (R$)
            </Label>
            <Input
              id="valor-m"
              inputMode="decimal"
              placeholder="Ex.: 1.500,00"
              value={valorStr}
              onChange={(e) => setValorStr(e.target.value)}
              required
              className={modalField}
            />
            {valorNum > 0 ? (
              <p className="mt-1.5 text-sm text-terra-600">
                Prévia: <span className="font-semibold text-terra-900">{formatBRL(valorNum)}</span>
              </p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="data-m" className={modalLabel}>
              Data
            </Label>
            <Input
              id="data-m"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={cn(modalField, "appearance-none [-webkit-appearance:none]")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className={modalLabel}>Categoria</span>
          <div className="grid grid-cols-3 gap-2.5">
            {CATEGORIAS_CUSTO.map((c) => {
              const Icon = iconMap[c.value];
              const sel = tipo === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setTipo(c.value)}
                  className={cn(
                    "flex h-[70px] min-h-[70px] flex-col items-center justify-center gap-1 rounded-xl px-2 text-center text-[12px] font-medium transition-interactive",
                    sel
                      ? "border-2 border-verde-600 bg-verde-50 text-verde-700"
                      : "border-[1.5px] border-terra-200 bg-white text-terra-700 hover:bg-terra-50",
                  )}
                >
                  {Icon ? (
                    <Icon
                      className={cn("h-6 w-6 shrink-0", sel ? iconColorSelected[c.value] : "text-terra-400")}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  ) : null}
                  <span className="leading-tight">{c.label}</span>
                </button>
              );
            })}
            <div className="hidden min-h-[70px] sm:block" aria-hidden />
          </div>
        </div>

        <div>
          <Label htmlFor="desc-m" className={modalLabel}>
            Observação <span className="font-normal text-terra-400">(opcional)</span>
          </Label>
          <textarea
            id="desc-m"
            rows={1}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={cn(modalField, "h-9 min-h-[36px] resize-none py-2 leading-snug")}
          />
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
            Registrar custo
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("mx-auto flex w-full max-w-[600px] flex-col gap-8", "px-4 py-8 sm:px-0")}
    >
      <div className="rounded-2xl border border-terra-200 bg-white p-6 shadow-card sm:p-8">
        <>
          <h1 className="text-2xl font-bold tracking-tight text-terra-950">Novo custo</h1>
          <p className="mt-1 text-sm text-terra-600">Preencha os dados do custo</p>
        </>

        <div className="mt-8 flex flex-col gap-6">
          <div className="space-y-2">
            <span className="text-[13px] font-medium text-terra-800">Categoria</span>
            <div className="grid grid-cols-3 gap-2.5">
              {CATEGORIAS_CUSTO.map((c) => {
                const Icon = iconMap[c.value];
                const sel = tipo === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setTipo(c.value)}
                    className={cn(
                      "flex h-[70px] min-h-[70px] flex-col items-center justify-center gap-1 rounded-xl px-2 text-center text-[12px] font-medium transition-interactive",
                      sel
                        ? "border-2 border-verde-600 bg-verde-50 text-verde-700"
                        : "border-[1.5px] border-terra-200 bg-white text-terra-700 hover:bg-terra-50",
                    )}
                  >
                    {Icon ? (
                      <Icon
                        className={cn("h-6 w-6 shrink-0", sel ? iconColorSelected[c.value] : "text-terra-400")}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    ) : null}
                    <span className="leading-tight">{c.label}</span>
                  </button>
                );
              })}
              <div className="hidden min-h-[70px] sm:block" aria-hidden />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-[13px] font-medium text-terra-800">
                Valor (R$)
              </Label>
              <Input
                id="valor"
                inputMode="decimal"
                placeholder="Ex.: 1.500,00"
                value={valorStr}
                onChange={(e) => setValorStr(e.target.value)}
                required
                className={fieldClass}
              />
              {valorNum > 0 ? (
                <p className="text-sm text-terra-600">
                  Prévia: <span className="font-semibold text-terra-900">{formatBRL(valorNum)}</span>
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="data" className="text-[13px] font-medium text-terra-800">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={cn(fieldClass, "appearance-none [-webkit-appearance:none]")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc" className="text-[13px] font-medium text-terra-800">
              Observação (opcional)
            </Label>
            <textarea
              id="desc"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={cn(fieldClass, "min-h-[96px] py-3")}
            />
          </div>
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
            Salvar custo
          </Button>
        </div>
      </div>
    </form>
  );
}

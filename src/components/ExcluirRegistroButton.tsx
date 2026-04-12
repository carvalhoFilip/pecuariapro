"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  tipo: "venda" | "custo";
  rotulo?: string;
  /** Só ícone (ex.: tabela com hover na linha) */
  iconOnly?: boolean;
};

export function ExcluirRegistroButton({ id, tipo, rotulo = "Excluir", iconOnly }: Props) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function remover() {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;
    setCarregando(true);
    try {
      const url = tipo === "venda" ? `/api/sales/${id}` : `/api/costs/${id}`;
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      const data = (await res.json()) as { mensagem?: string };
      if (!res.ok) {
        window.alert(data.mensagem ?? "Não foi possível excluir.");
        return;
      }
      router.refresh();
    } catch {
      window.alert("Sem conexão. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className={
        iconOnly
          ? "transition-interactive h-10 min-h-10 w-10 shrink-0 px-0 text-terra-400 hover:bg-red-50 hover:text-danger"
          : "transition-interactive min-h-10 text-danger hover:bg-red-50"
      }
      disabled={carregando}
      onClick={remover}
      aria-label="Excluir registro"
    >
      {carregando ? "…" : iconOnly ? <Trash2 className="h-4 w-4" /> : rotulo}
    </Button>
  );
}

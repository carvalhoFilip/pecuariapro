"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  tipo: "venda" | "custo";
  rotulo?: string;
};

export function ExcluirRegistroButton({ id, tipo, rotulo = "Excluir" }: Props) {
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
    <Button type="button" variant="ghost" className="min-h-10 text-red-800 hover:bg-red-50" disabled={carregando} onClick={remover}>
      {carregando ? "…" : rotulo}
    </Button>
  );
}

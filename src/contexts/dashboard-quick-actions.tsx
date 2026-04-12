"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Beef, Receipt } from "lucide-react";
import { SaleForm } from "@/components/forms/SaleForm";
import { CostForm } from "@/components/forms/CostForm";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import type { ButtonProps } from "@/components/ui/button";

type Ctx = {
  openNovaVenda: () => void;
  openNovoCusto: () => void;
};

const DashboardQuickActionsContext = createContext<Ctx | null>(null);

export function useDashboardQuickActions(): Ctx {
  const c = useContext(DashboardQuickActionsContext);
  if (!c) {
    throw new Error("useDashboardQuickActions deve ficar dentro de DashboardQuickActionsProvider");
  }
  return c;
}

export function DashboardQuickActionsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [vendaOpen, setVendaOpen] = useState(false);
  const [custoOpen, setCustoOpen] = useState(false);
  const [vendaKey, setVendaKey] = useState(0);
  const [custoKey, setCustoKey] = useState(0);

  useEffect(() => {
    setVendaOpen(false);
    setCustoOpen(false);
  }, [pathname]);

  const openNovaVenda = useCallback(() => {
    setCustoOpen(false);
    setVendaKey((k) => k + 1);
    setVendaOpen(true);
  }, []);

  const openNovoCusto = useCallback(() => {
    setVendaOpen(false);
    setCustoKey((k) => k + 1);
    setCustoOpen(true);
  }, []);

  const closeVenda = useCallback(() => setVendaOpen(false), []);
  const closeCusto = useCallback(() => setCustoOpen(false), []);

  const value = useMemo(
    () => ({
      openNovaVenda,
      openNovoCusto,
    }),
    [openNovaVenda, openNovoCusto],
  );

  return (
    <DashboardQuickActionsContext.Provider value={value}>
      {children}
      <Modal
        isOpen={vendaOpen}
        onClose={closeVenda}
        title="Nova venda"
        subtitle="Preencha os dados abaixo"
        icon={<Beef className="h-5 w-5" aria-hidden />}
        maxWidthClass="max-w-[560px]"
      >
        <SaleForm key={vendaKey} titleless onSaved={closeVenda} onDismiss={closeVenda} />
      </Modal>
      <Modal
        isOpen={custoOpen}
        onClose={closeCusto}
        title="Novo custo"
        subtitle="Registre um custo da fazenda"
        icon={<Receipt className="h-5 w-5" aria-hidden />}
        maxWidthClass="max-w-[560px]"
      >
        <CostForm key={custoKey} titleless onSaved={closeCusto} onDismiss={closeCusto} />
      </Modal>
    </DashboardQuickActionsContext.Provider>
  );
}

export function NovaVendaModalButton({ children, onClick, ...props }: ButtonProps) {
  const { openNovaVenda } = useDashboardQuickActions();
  return (
    <Button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        openNovaVenda();
      }}
    >
      {children}
    </Button>
  );
}

export function NovoCustoModalButton({ children, onClick, ...props }: ButtonProps) {
  const { openNovoCusto } = useDashboardQuickActions();
  return (
    <Button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        openNovoCusto();
      }}
    >
      {children}
    </Button>
  );
}

"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type SidebarCtx = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarCtx | null>(null);

export function useSidebar(): SidebarCtx {
  const c = useContext(SidebarContext);
  if (!c) {
    throw new Error("useSidebar deve ser usado dentro de SidebarProvider");
  }
  return c;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

"use client";

import Link from "next/link";
import { Beef, Menu } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";

export function MobileHeader() {
  const { setOpen } = useSidebar();

  return (
    <div
      className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-terra-200 bg-terra-50 px-4 py-3 md:hidden"
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-verde-700 text-white shadow-sm hover:bg-verde-800"
        aria-label="Abrir menu"
      >
        <Menu size={18} />
      </button>
      <Link href="/dashboard" className="flex min-w-0 shrink-0 items-center justify-end gap-2 text-terra-950">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-verde-700 text-white">
          <Beef className="h-3.5 w-3.5" aria-hidden />
        </span>
        <span className="truncate text-sm font-bold tracking-tight">Pecuária Pro</span>
      </Link>
    </div>
  );
}

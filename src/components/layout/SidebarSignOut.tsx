"use client";

import { LogOut } from "lucide-react";
import { getAuthClient } from "@/lib/auth-client";

export function SidebarSignOut() {
  async function handle() {
    try {
      await getAuthClient().signOut();
    } catch {
      /* ignore */
    }
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handle}
      className="transition-interactive flex w-full items-center justify-center gap-2 rounded-lg border border-terra-700 bg-terra-900 px-3 py-2.5 text-sm font-medium text-terra-100 hover:bg-terra-800"
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
      Sair
    </button>
  );
}

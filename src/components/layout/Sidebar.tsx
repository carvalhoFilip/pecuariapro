"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  History,
  CreditCard,
  LogOut,
  X,
} from "lucide-react";
import { getAuthClient } from "@/lib/auth-client";
import { useSidebar } from "@/contexts/sidebar-context";

const NAV = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/vendas", label: "Vendas", icon: TrendingUp },
  { href: "/custos", label: "Custos", icon: Wallet },
  { href: "/historico", label: "Histórico", icon: History },
  { href: "/assinatura", label: "Assinatura", icon: CreditCard },
];

function linkActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/historico") return pathname.startsWith("/historico");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ userEmail }: { userEmail: string | null }) {
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();

  async function handleSignOut() {
    try {
      await getAuthClient().signOut();
    } catch {
      /* ignore */
    }
    window.location.href = "/";
  }

  return (
    <div className="w-0 shrink-0 overflow-visible">
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[240px] flex-col overflow-x-hidden bg-[#1c1917] text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-5">
          <Link
            href="/dashboard"
            className="min-w-0 text-base font-bold tracking-tight text-white"
            onClick={() => setOpen(false)}
          >
            Pecuária Pro
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#1c1917] md:hidden"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = linkActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-verde-700 font-semibold text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-white/10 px-3 py-4">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-verde-700 text-xs font-bold text-white">
              {userEmail?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="truncate text-xs text-white/50" title={userEmail ?? undefined}>
              {userEmail ?? "—"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden />
            Sair
          </button>
        </div>
      </aside>
    </div>
  );
}

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
    window.location.href = "/login";
  }

  return (
    <div className="w-0 shrink-0 overflow-visible">
      {/* Overlay — só mobile quando aberta */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Sidebar — drawer no mobile, sempre visível no desktop; scroll só aqui quando necessário */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[240px] flex-col overflow-x-hidden bg-terra-950 shadow-[4px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-terra-800 px-4 py-4">
          <Link
            href="/dashboard"
            className="min-w-0 text-base font-bold tracking-tight text-white"
            onClick={() => setOpen(false)}
          >
            Pecuária Pro
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-terra-900 md:hidden"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = linkActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-verde-700 font-semibold text-white"
                    : "text-terra-100 hover:bg-terra-800 hover:text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-terra-800 bg-terra-950 p-4">
          <p className="mb-3 truncate text-xs text-terra-400" title={userEmail ?? undefined}>
            {userEmail ?? "—"}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-terra-700 bg-terra-900 px-3 py-2.5 text-sm font-medium text-terra-100 hover:bg-terra-800"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            Sair
          </button>
        </div>
      </aside>
    </div>
  );
}

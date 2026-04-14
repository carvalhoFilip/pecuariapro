"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Beef, CreditCard, History, LayoutDashboard, Menu, TrendingUp, Wallet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarSignOut } from "./SidebarSignOut";

const nav = [
  { href: "/dashboard", label: "Painel", Icon: LayoutDashboard },
  { href: "/vendas", label: "Vendas", Icon: TrendingUp },
  { href: "/custos", label: "Custos", Icon: Wallet },
  { href: "/historico", label: "Histórico", Icon: History },
  { href: "/assinatura", label: "Assinatura", Icon: CreditCard },
] as const;

function iniciais(email: string | null | undefined) {
  if (!email) return "?";
  const p = email.split("@")[0]?.slice(0, 2) ?? "?";
  return p.toUpperCase();
}

function truncarEmail(email: string, max = 28) {
  if (email.length <= max) return email;
  return `${email.slice(0, max - 1)}…`;
}

export type SidebarProps = {
  userEmail?: string | null;
};

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    setAberto(false);
  }, [pathname]);

  function linkAtivo(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/vendas") return pathname === "/vendas";
    if (href === "/custos") return pathname === "/custos";
    if (href === "/historico") return pathname.startsWith("/historico");
    if (href === "/assinatura") return pathname === "/assinatura";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const linkClass = (href: string) => {
    const ativo = linkAtivo(href);
    return cn(
      "transition-interactive flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium",
      ativo
        ? "bg-verde-700 font-semibold text-white"
        : "text-terra-100 hover:bg-terra-800 hover:text-white",
    );
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-0.5 px-3 py-2">
      {nav.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className={linkClass(href)} onClick={onNavigate}>
          <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );

  const BlocoSidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={cn(
        "flex h-full w-[240px] shrink-0 flex-col overflow-y-auto bg-terra-950 shadow-sidebar",
        mobile && "min-h-screen",
      )}
    >
      <div className="border-b border-terra-800 px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => mobile && setAberto(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-verde-800 text-white">
            <Beef className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-base font-bold tracking-tight text-white">Pecuária Pro</p>
            <p className="text-xs text-terra-400">Gestão financeira</p>
          </div>
        </Link>
      </div>

      <NavLinks onNavigate={() => mobile && setAberto(false)} />

      <div className="mt-auto border-t border-terra-800 p-4">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terra-800 text-sm font-semibold text-verde-100"
            aria-hidden
          >
            {iniciais(userEmail)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-terra-400" title={userEmail ?? undefined}>
              {userEmail ? truncarEmail(userEmail) : "—"}
            </p>
          </div>
        </div>
        <SidebarSignOut />
        <Link
          href="/"
          className="transition-interactive mt-3 block text-center text-xs text-terra-400 hover:text-terra-200"
        >
          Página inicial
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-terra-200 bg-terra-50 px-4 md:hidden">
        <button
          type="button"
          className="transition-interactive flex h-11 w-11 items-center justify-center rounded-lg border border-terra-200 bg-white text-terra-900 hover:bg-terra-100"
          aria-label="Abrir menu"
          onClick={() => setAberto(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-terra-950">
          <Beef className="h-5 w-5 text-verde-700" aria-hidden />
          Pecuária Pro
        </Link>
        <span className="w-11" aria-hidden />
      </div>

      {/* Mobile drawer */}
      {aberto ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 transition-opacity"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
          />
          <div className="absolute left-0 top-0 flex h-full shadow-2xl">
            <BlocoSidebar mobile />
            <button
              type="button"
              className="absolute left-[240px] top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-terra-900 shadow-md"
              aria-label="Fechar"
              onClick={() => setAberto(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Desktop: fixa na viewport (evita `hidden md:flex`, que em alguns builds deixa display:none no ≥md) */}
      <div className="max-md:hidden fixed left-0 top-0 z-[100] flex h-screen w-[240px] flex-col">
        <BlocoSidebar />
      </div>
    </>
  );
}

import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Painel" },
  { href: "/vendas", label: "Vendas" },
  { href: "/vendas/nova", label: "Adicionar Venda" },
  { href: "/custos", label: "Custos" },
  { href: "/custos/novo", label: "Adicionar custo" },
  { href: "/historico", label: "Histórico" },
];

export function Sidebar() {
  return (
    <aside className="flex w-full flex-col gap-1 border-b border-emerald-900/20 bg-emerald-950 p-4 text-white sm:w-56 sm:border-b-0 sm:border-r">
      <Link href="/dashboard" className="mb-3 text-lg font-bold tracking-tight text-white">
        Pecuária Pro
      </Link>
      <nav className="flex flex-row flex-wrap gap-2 sm:flex-col sm:gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-900/60 hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/"
        className="mt-4 hidden text-sm text-emerald-200/90 hover:text-white sm:block"
      >
        ← Página inicial
      </Link>
    </aside>
  );
}

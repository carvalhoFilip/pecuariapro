"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PagamentoNavLinkProps = {
  href: string;
  className?: string;
  spinnerClassName?: string;
  children: ReactNode;
};

export function PagamentoNavLink({
  href,
  className,
  spinnerClassName = "h-4 w-4 shrink-0 animate-spin",
  children,
}: PagamentoNavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [clicked, setClicked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const busy = clicked || isPending;

  useEffect(() => {
    if (pathname.startsWith("/pagamento")) {
      setClicked(false);
    }
  }, [pathname]);

  return (
    <Link
      href={href}
      className={cn(className, busy && "pointer-events-none opacity-90")}
      aria-busy={busy}
      onClick={(e) => {
        if (busy) {
          e.preventDefault();
          return;
        }
        let next: URL;
        try {
          next = new URL(href, window.location.origin);
        } catch {
          return;
        }
        const here = `${window.location.pathname}${window.location.search}`;
        const dest = `${next.pathname}${next.search}`;
        if (here === dest) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        setClicked(true);
        startTransition(() => {
          router.push(href);
        });
      }}
    >
      {busy ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className={spinnerClassName} aria-hidden />
          {children}
        </span>
      ) : (
        children
      )}
    </Link>
  );
}

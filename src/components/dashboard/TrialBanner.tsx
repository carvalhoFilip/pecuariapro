"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TrialBannerProps {
  trialEndsAt: Date | string | null;
  subscriptionStatus: string | null;
}

export function TrialBanner({ trialEndsAt, subscriptionStatus }: TrialBannerProps) {
  if (subscriptionStatus !== "trialing" || !trialEndsAt) return null;

  const end = new Date(trialEndsAt);
  const now = new Date();
  const diasRestantes = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diasRestantes > 3) return null;

  const urgente = diasRestantes <= 1;

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4 border-b px-4 py-3",
        urgente ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50",
      )}
    >
      <p className={cn("text-sm font-medium", urgente ? "text-red-700" : "text-amber-700")}>
        {diasRestantes <= 0
          ? "O seu período de teste terminou hoje."
          : diasRestantes === 1
            ? "Último dia do seu período de teste."
            : `O seu período de teste termina em ${diasRestantes} dias.`}
      </p>
      <Link
        href="/pagamento"
        className={cn(
          "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white",
          urgente ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700",
        )}
      >
        Assinar agora →
      </Link>
    </div>
  );
}

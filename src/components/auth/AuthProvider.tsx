"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import "@neondatabase/auth/ui/css";
import { getAuthClient } from "@/lib/auth-client";
import { pecuariaAuthLocalization } from "@/lib/auth-ui-localization";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      authClient={getAuthClient()}
      redirectTo="/dashboard"
      localization={pecuariaAuthLocalization}
    >
      {children}
    </NeonAuthUIProvider>
  );
}

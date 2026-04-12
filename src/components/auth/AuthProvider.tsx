"use client";

import { NeonAuthUIProvider, authLocalization } from "@neondatabase/auth/react/ui";
import "@neondatabase/auth/ui/css";
import { getAuthClient } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      authClient={getAuthClient()}
      redirectTo="/dashboard"
      localization={authLocalization}
    >
      {children}
    </NeonAuthUIProvider>
  );
}

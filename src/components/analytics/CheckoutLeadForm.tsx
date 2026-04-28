"use client";

import type { ReactNode } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel";

export function CheckoutLeadForm({ children }: { children: ReactNode }) {
  function handleSubmit() {
    trackMetaEvent("InitiateCheckout");
  }

  return (
    <form action="/api/stripe/checkout" method="POST" onSubmit={handleSubmit}>
      {children}
    </form>
  );
}

"use client";

import type { ReactNode } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel";

export function CheckoutLeadForm({ children }: { children: ReactNode }) {
  function handleSubmit() {
    trackMetaEvent("Lead", {
      content_name: "Trial Checkout Pecuaria Pro",
      lead_type: "trial_start",
    });
  }

  return (
    <form action="/api/stripe/checkout" method="POST" onSubmit={handleSubmit}>
      {children}
    </form>
  );
}

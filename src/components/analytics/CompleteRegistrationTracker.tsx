"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { REGISTER_INTENT_KEY } from "@/components/analytics/RegisterIntentTracker";

export function CompleteRegistrationTracker() {
  useEffect(() => {
    const hasRegisterIntent = window.localStorage.getItem(REGISTER_INTENT_KEY) === "1";
    if (!hasRegisterIntent) return;

    trackMetaEvent("CompleteRegistration", {
      status: "completed",
      content_name: "Cadastro Pecuaria Pro",
    });
    window.localStorage.removeItem(REGISTER_INTENT_KEY);
  }, []);

  return null;
}

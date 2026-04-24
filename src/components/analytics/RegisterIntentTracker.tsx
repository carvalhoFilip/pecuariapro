"use client";

import { useEffect } from "react";

const REGISTER_INTENT_KEY = "pp_register_intent";

export function RegisterIntentTracker() {
  useEffect(() => {
    window.localStorage.setItem(REGISTER_INTENT_KEY, "1");
  }, []);

  return null;
}

export { REGISTER_INTENT_KEY };

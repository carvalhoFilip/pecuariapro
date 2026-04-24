"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel";

export function LandingPixelEvents() {
  useEffect(() => {
    trackMetaEvent("PageView");
    trackMetaEvent("ViewContent", {
      content_name: "Landing Pecuaria Pro",
      content_type: "landing_page",
    });
  }, []);

  return null;
}

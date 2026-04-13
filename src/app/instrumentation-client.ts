import type { NextWebVitalsMetric } from "next/app";

function sendMetric(metric: NextWebVitalsMetric) {
  if (typeof navigator === "undefined") return;
  const payload = JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: metric.value,
    label: metric.label,
    url: window.location.pathname,
  });
  navigator.sendBeacon("/api/metrics/web-vitals", payload);
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NODE_ENV !== "production") return;
  sendMetric(metric);
}

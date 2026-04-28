export function trackMetaEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) {
    window.fbq("track", eventName, params);
    return;
  }
  window.fbq("track", eventName);
}

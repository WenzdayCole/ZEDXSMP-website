export const CHECKOUT_RETURN_KEY = "zedx-checkout-return";

export function sanitizeCheckoutReturnPath(path) {
  if (!path || typeof path !== "string") return "/ranks";
  if (!path.startsWith("/ranks") || path.includes("://")) return "/ranks";
  return path;
}

export function persistCheckoutReturnPath(path) {
  if (typeof window === "undefined") return;
  try {
    if (!path && sessionStorage.getItem(CHECKOUT_RETURN_KEY)) return;
    const safe = sanitizeCheckoutReturnPath(
      path || `${window.location.pathname}${window.location.hash}`,
    );
    sessionStorage.setItem(CHECKOUT_RETURN_KEY, safe);
  } catch {
    /* ignore */
  }
}

export function consumeCheckoutReturnPath() {
  if (typeof window === "undefined") return "/ranks";
  try {
    const stored = sessionStorage.getItem(CHECKOUT_RETURN_KEY);
    sessionStorage.removeItem(CHECKOUT_RETURN_KEY);
    return sanitizeCheckoutReturnPath(stored || "/ranks");
  } catch {
    return "/ranks";
  }
}

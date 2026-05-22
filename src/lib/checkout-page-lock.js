/**
 * Clears document-level locks left by checkout modals / Tebex redirects.
 * Does not remove React-managed nodes (that causes bfcache desync / blank pages).
 */
export function releaseCheckoutPageLock() {
  if (typeof document === "undefined") return;

  document.body.style.overflow = "";
  document.body.style.pointerEvents = "";
  document.documentElement.style.overflow = "";
  document.documentElement.style.pointerEvents = "";

  document.body.classList.remove("checkout-locked");
  document.documentElement.classList.remove("checkout-locked");
}

export function lockCheckoutPage() {
  if (typeof document === "undefined") return;
  document.body.classList.add("checkout-locked");
  document.body.style.overflow = "hidden";
}

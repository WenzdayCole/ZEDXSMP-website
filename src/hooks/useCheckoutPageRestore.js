"use client";

import { useEffect } from "react";
import { releaseCheckoutPageLock } from "@/lib/checkout-page-lock";

/**
 * Run after browser back/forward from Tebex (bfcache) or external return URLs.
 */
export function useCheckoutPageRestore(onRestore) {
  useEffect(() => {
    const handleRestore = (event) => {
      const persisted = Boolean(event?.persisted);
      const nav =
        typeof performance !== "undefined"
          ? performance.getEntriesByType("navigation")[0]
          : null;
      const isBackForward = nav?.type === "back_forward";

      if (!persisted && !isBackForward) return;

      releaseCheckoutPageLock();
      onRestore?.();

      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);
      if (!url.searchParams.has("checkout")) return;

      url.searchParams.delete("checkout");
      url.searchParams.delete("basket");
      const next =
        url.pathname +
        (url.searchParams.toString() ? `?${url.searchParams}` : "") +
        url.hash;
      window.history.replaceState({}, "", next);
    };

    window.addEventListener("pageshow", handleRestore);
    return () => window.removeEventListener("pageshow", handleRestore);
  }, [onRestore]);
}

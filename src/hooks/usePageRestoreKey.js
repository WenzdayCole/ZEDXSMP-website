"use client";

import { useEffect, useState } from "react";

/**
 * Bump key when the page is restored from bfcache (browser Back from Tebex)
 * so client components re-mount cleanly.
 */
export function usePageRestoreKey() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const bump = (event) => {
      if (!event?.persisted) return;
      setKey((k) => k + 1);
    };

    window.addEventListener("pageshow", bump);
    return () => window.removeEventListener("pageshow", bump);
  }, []);

  return key;
}

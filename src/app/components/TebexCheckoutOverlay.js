"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { buildPayCheckoutUrl, mountTebexCheckoutEmbed } from "@/lib/tebex-js";

export default function TebexCheckoutOverlay({
  open,
  ident,
  checkoutUrl,
  itemName,
  itemPrice,
  onClose,
  onPaymentComplete,
}) {
  const searchParams = useSearchParams();
  const containerRef = useRef(null);
  const sessionRef = useRef(null);
  const onPaymentCompleteRef = useRef(onPaymentComplete);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [embedMode, setEmbedMode] = useState(null);

  onPaymentCompleteRef.current = onPaymentComplete;

  const hostedUrl =
    checkoutUrl || buildPayCheckoutUrl(ident) || null;

  // Tebex redirects to complete_url after payment — close overlay when we land back
  useEffect(() => {
    if (searchParams.get("checkout") === "success" && open) {
      onPaymentCompleteRef.current?.();
    }
  }, [searchParams, open]);

  useEffect(() => {
    if (!open || (!ident && !hostedUrl)) return;

    let cancelled = false;

    document.body.style.overflow = "hidden";

    async function boot() {
      setLoading(true);
      setError("");
      setEmbedMode(null);

      await new Promise((r) => setTimeout(r, 200));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      if (cancelled || !containerRef.current) return;

      try {
        sessionRef.current?.destroy();

        const session = await mountTebexCheckoutEmbed({
          ident,
          checkoutUrl: hostedUrl,
          container: containerRef.current,
          onPaymentComplete: () => {
            if (!cancelled) onPaymentCompleteRef.current?.();
          },
        });

        sessionRef.current = session;

        if (cancelled) {
          session.destroy();
          return;
        }

        setEmbedMode(session.mode);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not open checkout. Try again.",
          );
          setLoading(false);
        }
      }
    }

    boot();

    return () => {
      cancelled = true;
      sessionRef.current?.destroy();
      sessionRef.current = null;
      document.body.style.overflow = "";
    };
  }, [open, ident, hostedUrl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (ident || hostedUrl) && (
        <motion.div
          className="fixed inset-0 z-[400] flex flex-col bg-[#030108]/80 backdrop-blur-xl"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Slim top bar — leaves maximum room for Tebex checkout */}
          <motion.div className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#08080e]/95 px-4 pb-2.5 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:py-2.5">
            <motion.div className="min-w-0">
              <p className="truncate text-[9px] font-black uppercase tracking-[0.4em] text-purple-400">
                ZEDX SMP checkout
              </p>
              <p className="truncate text-sm font-black uppercase italic text-white">
                {itemName || "Your order"}
                {itemPrice ? (
                  <span className="ml-2 font-mono text-xs font-bold text-cyan-400/80 not-italic">
                    {itemPrice}
                  </span>
                ) : null}
              </p>
            </motion.div>

            <motion.div className="flex shrink-0 items-center gap-2">
              {hostedUrl && (
                <a
                  href={hostedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/50 hover:border-purple-500/40 hover:text-white"
                >
                  New tab
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 p-2 text-white/40 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>

          <motion.div className="relative min-h-0 flex-1 overflow-hidden bg-[#111118]">
            {loading && !error && (
              <motion.div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#111118]">
                <motion.div className="h-2 w-2 rounded-full bg-purple-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/45">
                  Loading checkout…
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="max-w-sm text-sm text-red-300">{error}</p>
                {hostedUrl && (
                  <a
                    href={hostedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-purple-600 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-purple-500"
                  >
                    Open Tebex checkout
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-white/10 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white"
                >
                  Close
                </button>
              </motion.div>
            )}

            {embedMode === "popup" && !loading && !error && (
              <motion.div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-purple-400">
                  Checkout opened
                </p>
                <p className="max-w-md text-sm text-white/60">
                  Finish payment in the Tebex window. When done, you will return
                  here automatically.
                </p>
                {hostedUrl && (
                  <a
                    href={hostedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-purple-500 hover:text-white"
                  >
                    Open checkout
                  </a>
                )}
              </motion.div>
            )}

            <motion.div
              ref={containerRef}
              className={`h-full w-full overflow-y-auto ${
                embedMode === "popup" ? "hidden" : "block"
              } [&_iframe]:!block [&_iframe]:!min-h-[calc(100dvh-56px)] [&_iframe]:!w-full [&_iframe]:!border-0`}
              data-embed-mode={embedMode || undefined}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

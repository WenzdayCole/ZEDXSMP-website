"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSuccess = searchParams.get("checkout") === "success";
  const [dismissed, setDismissed] = useState(false);
  const visible = isSuccess && !dismissed;

  const dismiss = useCallback(() => {
    setDismissed(true);
    router.replace("/ranks", { scroll: false });
  }, [router]);

  useEffect(() => {
    if (!visible) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);

    const timer = setTimeout(dismiss, 12000);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[#050208]/85 backdrop-blur-md"
        onClick={dismiss}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-success-title"
        className="relative w-full max-w-lg animate-hero-fade-up overflow-hidden rounded-3xl border border-green-500/25 bg-[#0a0812] shadow-[0_0_80px_rgba(34,197,94,0.12),0_0_120px_rgba(168,85,247,0.08)]"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-green-500/15 via-purple-500/5 to-transparent"
          aria-hidden
        />

        <div className="relative px-8 py-10 text-center sm:px-10 sm:py-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-400/30 bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.25)]">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.45em] text-green-400">
            Payment successful
          </p>

          <h2
            id="checkout-success-title"
            className="mt-3 text-3xl font-black uppercase italic leading-none tracking-tighter text-white sm:text-4xl"
          >
            Thank you!
          </h2>

          <p className="mx-auto mt-5 max-w-sm text-sm font-medium leading-relaxed text-white/70">
            Your purchase went through. Ranks and crate keys are delivered to
            your Minecraft account — usually within a few minutes.
          </p>

          <p className="mx-auto mt-3 max-w-sm text-[11px] font-bold uppercase tracking-wide text-white/45">
            Join at zedxsmp.fun if you&apos;re not online yet
          </p>

          <button
            type="button"
            onClick={dismiss}
            className="mt-8 w-full rounded-2xl border border-green-500/30 bg-green-500/15 px-6 py-4 text-[11px] font-black uppercase tracking-[0.25em] text-green-300 transition-all hover:border-green-400/50 hover:bg-green-500/25 hover:text-green-200"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

export default function CheckoutRedirectScreen({
  title = "Connecting to payment",
  message = "Taking you to Tebex secure checkout…",
  error,
  backHref = "/ranks",
  overlay = false,
}) {
  const shell = overlay
    ? "fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#030108] px-6"
    : "flex min-h-[100dvh] flex-col items-center justify-center bg-[#030108] px-6";
  const overlayProps = overlay ? { "data-checkout-overlay": true } : {};

  if (error) {
    return (
      <div className={`${shell} text-center`} {...overlayProps}>
        <p className="text-sm text-red-300">{error}</p>
        <Link
          href={backHref}
          className="mt-6 rounded-xl bg-white/10 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white"
        >
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className={shell} {...overlayProps}>
      <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-cyan-400" />
      </div>
      <p className="mt-8 text-[10px] font-black uppercase tracking-[0.45em] text-purple-400">
        {title}
      </p>
      <p className="mt-3 max-w-xs text-center text-sm text-white/50">{message}</p>
    </div>
  );
}

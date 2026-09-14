"use client";

import { formatGbp } from "@/lib/store-products";
import { useCheckout } from "@/context/CheckoutContext";

function CartIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3.5 5h1.6l1.3 9.2a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.6L20 8H7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.2" fill="currentColor" />
      <circle cx="17" cy="19" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function BasketNavButton({ className = "" }) {
  const { ready, count, totalPence, setBasketOpen } = useCheckout();

  return (
    <button
      type="button"
      onClick={() => setBasketOpen(true)}
      className={`relative inline-flex h-12 min-w-[7.5rem] items-center justify-center gap-2.5 rounded-full border border-purple-400/40 bg-purple-500/20 px-5 text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:border-purple-300/60 hover:bg-purple-500/35 sm:h-14 sm:min-w-[9rem] sm:px-6 sm:text-base ${className}`.trim()}
    >
      <span className="relative">
        <CartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        {ready && count > 0 ? (
          <span className="absolute -right-2.5 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-black sm:h-6 sm:min-w-6 sm:text-[11px]">
            {count}
          </span>
        ) : null}
      </span>
      Basket
      {ready && count > 0 ? (
        <span className="hidden font-mono text-[12px] font-black normal-case tracking-normal text-purple-100 sm:inline sm:text-sm">
          {formatGbp(totalPence)}
        </span>
      ) : null}
    </button>
  );
}

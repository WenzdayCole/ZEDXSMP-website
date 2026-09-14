"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCheckout } from "@/context/CheckoutContext";
import { getProduct } from "@/lib/store-products";

export default function BasketToast() {
  const { ready, toast, basketOpen, setBasketOpen } = useCheckout();
  const product = ready && toast ? getProduct(toast.productId) : null;
  const visible = Boolean(toast && product && !basketOpen);

  return (
    <div className="pointer-events-none fixed top-auto right-0 bottom-28 left-0 z-[90] flex justify-center px-4 md:bottom-32">
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            onClick={() => setBasketOpen(true)}
            className="pointer-events-auto flex max-w-[min(24rem,calc(100vw-2rem))] items-center gap-3 rounded-full border border-white/15 bg-[#1a1028]/95 py-3 pl-3 pr-5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6.5 12.5 10 16l7.5-8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-[9px] font-black uppercase tracking-[0.28em] text-purple-300">
                Added to basket
              </span>
              <span className="mt-0.5 block truncate text-[13px] font-black uppercase tracking-wide text-white">
                {product.name}
                {toast.quantity > 1 ? ` ×${toast.quantity}` : ""}
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

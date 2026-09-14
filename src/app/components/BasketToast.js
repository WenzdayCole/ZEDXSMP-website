"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCheckout } from "@/context/CheckoutContext";
import { getProduct } from "@/lib/store-products";

export default function BasketToast() {
  const { ready, toast, setBasketOpen } = useCheckout();
  const product = ready && toast ? getProduct(toast.productId) : null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {toast && product && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            onClick={() => setBasketOpen(true)}
            className="pointer-events-auto rounded-2xl border border-purple-200 bg-white px-6 py-4 text-left shadow-[0_16px_50px_rgba(147,51,234,0.4)]"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-purple-600">
              Added to basket
            </p>
            <p className="mt-1 text-base font-black uppercase tracking-wide text-black">
              {product.name}
              {toast.quantity > 1 ? ` ×${toast.quantity}` : ""}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
              Tap to view basket
            </p>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

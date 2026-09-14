"use client";

import { AnimatePresence, motion } from "framer-motion";
import { formatGbp, getProduct } from "@/lib/store-products";
import { useCheckout } from "@/context/CheckoutContext";

function CartIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
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

export default function BasketBar() {
  const {
    ready,
    items,
    count,
    totalPence,
    removeItem,
    setQuantity,
    clearBasket,
    checkoutBasket,
    basketOpen,
    setBasketOpen,
  } = useCheckout();

  if (!ready) return null;
  if (!count && !basketOpen) return null;

  const hasSubscription = items.some(
    (item) => getProduct(item.product)?.mode === "subscription",
  );

  return (
    <>
      <AnimatePresence>
        {basketOpen && (
          <motion.button
            type="button"
            aria-label="Close basket"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBasketOpen(false)}
            className="fixed inset-0 z-[79] bg-black/55 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 left-1/2 z-[80] w-[min(42rem,calc(100%-2rem))] -translate-x-1/2 md:bottom-6 md:w-[min(36rem,calc(100%-3rem))] xl:w-[min(40rem,calc(100%-4rem))]">
        <AnimatePresence initial={false}>
          {basketOpen && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="mb-3 overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#09040f]/96 shadow-[0_0_50px_rgba(147,51,234,0.28)] backdrop-blur-2xl md:rounded-[2.1rem]"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 md:px-6 md:py-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-purple-300 md:text-[11px]">
                    Your basket
                  </p>
                  <p className="mt-1 text-[11px] font-bold text-white/40 md:text-[12px]">
                    {count} item{count === 1 ? "" : "s"}
                    {hasSubscription ? " · includes monthly rank" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBasketOpen(false)}
                  className="rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/35 hover:bg-white/5 hover:text-white md:text-[11px]"
                >
                  Close
                </button>
              </div>

              <ul className="max-h-[min(22rem,48vh)] space-y-2.5 overflow-auto px-4 py-4 md:max-h-[min(26rem,52vh)] md:space-y-3 md:px-5 md:py-5">
                {!count ? (
                  <li className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-8 text-center md:px-5">
                    <p className="text-[13px] font-black uppercase tracking-wide text-white">
                      Basket is empty
                    </p>
                    <p className="mt-2 text-[11px] font-bold text-white/40">
                      Add a rank or crate keys from the store.
                    </p>
                  </li>
                ) : null}
                {items.map((item) => {
                  const product = getProduct(item.product);
                  if (!product) return null;
                  const line = product.amountPence * item.quantity;
                  const isRank = product.type === "rank";
                  return (
                    <li
                      key={item.product}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5 md:px-5 md:py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-black uppercase tracking-wide text-white md:text-[14px]">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35 md:text-[11px]">
                            {isRank
                              ? product.mode === "subscription"
                                ? "Monthly rank"
                                : "1 month rank"
                              : "Crate key"}
                          </p>
                        </div>
                        <p className="shrink-0 font-mono text-[13px] font-black text-white md:text-[15px]">
                          {formatGbp(line)}
                          {product.mode === "subscription" ? (
                            <span className="text-white/35">/mo</span>
                          ) : null}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 md:mt-4">
                        {isRank ? (
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 md:text-[11px]">
                            Qty locked to 1
                          </span>
                        ) : (
                          <div className="inline-flex items-center overflow-hidden rounded-xl border border-white/10 bg-black/30">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.product, item.quantity - 1)
                              }
                              className="px-3.5 py-2 text-[14px] font-black text-white/70 hover:bg-white/10 hover:text-white md:px-4"
                              aria-label={`Decrease ${product.name}`}
                            >
                              −
                            </button>
                            <span className="min-w-9 px-1 text-center font-mono text-[12px] font-black text-white md:text-[13px]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.product, item.quantity + 1)
                              }
                              className="px-3.5 py-2 text-[14px] font-black text-white/70 hover:bg-white/10 hover:text-white md:px-4"
                              aria-label={`Increase ${product.name}`}
                            >
                              +
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(item.product)}
                          className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30 hover:text-red-400 md:text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-3 border-t border-white/8 px-5 py-4 md:space-y-4 md:px-6 md:py-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/35 md:text-[10px]">
                      Total
                    </p>
                    <p className="font-mono text-3xl font-black tracking-tight text-white md:text-4xl">
                      {formatGbp(totalPence)}
                      {hasSubscription ? (
                        <span className="ml-1 text-base text-white/35 md:text-lg">/mo+</span>
                      ) : null}
                    </p>
                  </div>
                  {count > 0 ? (
                    <button
                      type="button"
                      onClick={clearBasket}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white md:text-[11px]"
                    >
                      Clear all
                    </button>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={checkoutBasket}
                  disabled={!count}
                  className="w-full rounded-2xl bg-white py-4 text-[11px] font-black uppercase tracking-[0.28em] text-black transition-colors hover:bg-purple-500 hover:text-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40 md:py-5 md:text-[12px]"
                >
                  Checkout basket
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {count > 0 ? (
        <motion.button
          type="button"
          layout
          onClick={() => setBasketOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-purple-500/30 bg-[#0a0612]/95 px-4 py-3.5 shadow-[0_0_40px_rgba(147,51,234,0.25)] backdrop-blur-xl md:px-5 md:py-4"
        >
          <span className="inline-flex items-center gap-3 text-white md:gap-4">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-200 md:h-11 md:w-11">
              <CartIcon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-500 px-1 text-[9px] font-black text-white md:h-5 md:min-w-5 md:text-[10px]">
                {count}
              </span>
            </span>
            <span className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-[0.28em] text-purple-300 md:text-[11px]">
                {basketOpen ? "Hide basket" : "View basket"}
              </span>
              <span className="font-mono text-base font-black text-white md:text-lg">
                {formatGbp(totalPence)}
                {hasSubscription ? "/mo+" : ""}
              </span>
            </span>
          </span>
          {!basketOpen && (
            <span className="rounded-xl bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black md:px-5 md:text-[11px]">
              Open
            </span>
          )}
        </motion.button>
        ) : null}
      </div>
    </>
  );
}

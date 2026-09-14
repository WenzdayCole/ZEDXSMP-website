"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { crateKeys } from "@/data/crate-keys";
import { useCheckout } from "@/context/CheckoutContext";
import { useCheckoutPageRestore } from "@/hooks/useCheckoutPageRestore";

export default function CrateKeysSection() {
  const { checkout, isLoading, addItem } = useCheckout();
  const [selectedCrate, setSelectedCrate] = useState(null);

  useCheckoutPageRestore(() => setSelectedCrate(null));

  useEffect(() => {
    if (window.location.hash !== "#keys") return;
    const timer = setTimeout(() => {
      document.getElementById("keys")?.scrollIntoView({ behavior: "instant" });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedCrate) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedCrate(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedCrate]);

  return (
    <>
      <div id="keys" className="mb-20 scroll-mt-24">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">
            Crate <span className="text-purple-400">Keys</span>
          </h2>
          <div className="hidden h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent md:block" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {crateKeys.map((key) => (
            <motion.div
              layoutId={`crate-${key.productId}`}
              key={key.name}
              initial={false}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedCrate(key);
                }
              }}
              onClick={() => setSelectedCrate(key)}
              className={`group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-[3rem] border bg-white/5 p-10 text-center shadow-2xl transition-all ${key.border} ${key.hover} ${key.glow}`}
            >
              <div className="relative mb-8 h-36 w-36">
                <Image
                  src={key.img}
                  alt={key.name}
                  fill
                  unoptimized
                  className="object-contain transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                  sizes="144px"
                />
              </div>
              <h3
                className={`mb-1 text-3xl font-black uppercase italic tracking-tighter ${key.color}`}
              >
                {key.name}
              </h3>
              <p className="mb-6 font-mono text-xl font-black text-white/80">
                {key.price}
              </p>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/70 transition-colors group-hover:text-white">
                View Details
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCrate && (
          <div
            data-checkout-overlay
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCrate(null)}
              className="absolute inset-0 bg-[#050208]/95 backdrop-blur-2xl transform-gpu"
            />
            <motion.div
              layoutId={`crate-${selectedCrate.productId}`}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className={`relative z-10 w-full max-w-2xl overflow-hidden rounded-[4rem] border bg-[#0a0a0a] p-8 shadow-2xl md:p-16 ${selectedCrate.border}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedCrate(null)}
                className="absolute right-8 top-8 z-50 text-2xl font-black text-white/70 transition-colors hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 h-64 w-64 rounded-[2rem] bg-white/[0.07] ring-1 ring-white/10 md:mb-10 md:h-80 md:w-80">
                  <Image
                    src={selectedCrate.crateImg}
                    alt={selectedCrate.name}
                    fill
                    unoptimized
                    className="object-contain p-4 drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                    sizes="(max-width: 768px) 256px, 320px"
                  />
                </div>
                <h2
                  className={`mb-4 text-4xl font-black uppercase italic tracking-tighter md:mb-6 md:text-6xl ${selectedCrate.color}`}
                >
                  {selectedCrate.name} Crate
                </h2>
                <p className="mb-8 max-w-lg text-sm leading-relaxed text-white/80 md:mb-12 md:text-base">
                  {selectedCrate.description}
                </p>
                <div className="grid w-full gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(selectedCrate.productId);
                      setSelectedCrate(null);
                    }}
                    className="w-full rounded-3xl border border-white/20 bg-white/8 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/15"
                  >
                    Add to basket
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      checkout(
                        selectedCrate.productId,
                        selectedCrate.tebexName,
                        { price: selectedCrate.price, type: "key" },
                      );
                    }}
                    className="w-full rounded-3xl bg-white py-5 text-[12px] font-black uppercase tracking-[0.2em] text-black shadow-2xl transition-all hover:bg-purple-500 hover:text-white md:py-6"
                  >
                    {isLoading(selectedCrate.tebexName)
                      ? "Generating Receipt..."
                      : `Purchase for ${selectedCrate.price}`}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

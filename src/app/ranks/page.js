"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckout } from "@/context/CheckoutContext";
import { crateKeys } from "@/data/crate-keys";
import { getStoreRankCards } from "@/data/monthly-ranks";
import { useCheckoutPageRestore } from "@/hooks/useCheckoutPageRestore";
import { usePageRestoreKey } from "@/hooks/usePageRestoreKey";

export default function RanksPage() {
  const { checkout, isLoading, resetCheckoutUi } = useCheckout();
  const pageKey = usePageRestoreKey();
  const [selectedCrate, setSelectedCrate] = useState(null);

  useCheckoutPageRestore(() => {
    resetCheckoutUi();
    setSelectedCrate(null);
  });

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

  const monthlyRanks = getStoreRankCards();

  return (
    <main
      key={pageKey}
      className="relative z-10 min-h-screen overflow-x-hidden p-6 font-sans text-white selection:bg-purple-500/30 md:p-12"
    >
      <div className="relative mx-auto max-w-7xl">
        <header className="mb-20 text-center md:text-left">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 transition-all hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>{" "}
            Back to Home
          </Link>
          <h1 className="mt-4 text-6xl font-black uppercase italic leading-none tracking-tighter md:text-7xl">
            Server <span className="text-purple-500">Store</span>
          </h1>
        </header>

        <div className="mb-32 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {monthlyRanks.map((rank) => (
            <div
              key={rank.name}
              className="group relative flex flex-col transition-transform duration-500 hover:-translate-y-2"
            >
              {rank.popular && (
                <div
                  className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-black shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${rank.accent}, #FF6600)`,
                    boxShadow: `0 4px 20px ${rank.accent}66`,
                  }}
                >
                  Most Popular
                </div>
              )}
              <div
                className="absolute -inset-[1.5px] overflow-hidden rounded-[2.6rem] max-lg:hidden"
                aria-hidden
              >
                <div
                  className="absolute inset-[-250%] animate-border-glow"
                  style={{ background: rank.borderGlow }}
                />
              </div>
              <div
                className="relative z-10 flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border bg-[#050208] p-8"
                style={{ borderColor: `${rank.accent}33` }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${rank.accent}, transparent)`,
                  }}
                />
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${rank.color} opacity-[0.14] transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative mb-8">
                  <span
                    className="mb-2 block text-[9px] font-black uppercase tracking-[0.3em]"
                    style={{ color: rank.accentDim }}
                  >
                    {rank.title}
                  </span>
                  <h2
                    className={`mb-4 text-4xl font-black uppercase italic tracking-tighter ${rank.nameClass}`}
                  >
                    {rank.name}
                  </h2>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-5xl font-black tracking-tighter text-white">
                      {rank.price}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase"
                      style={{ color: rank.accentDim }}
                    >
                      {rank.period}
                    </span>
                  </div>
                </div>
                <ul className="relative mb-10 flex-1 space-y-3">
                  {rank.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-[11px] font-bold text-white/60 transition-colors group-hover:text-white/90"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: rank.accent,
                          boxShadow: `0 0 8px ${rank.accent}`,
                        }}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() =>
                    checkout(rank.id, rank.checkoutName, {
                      price: rank.price + rank.period,
                    })
                  }
                  style={{ "--rank-accent": rank.accent }}
                  className="relative z-20 w-full rounded-2xl bg-white py-5 text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-[var(--rank-accent)] hover:text-white"
                >
                  {isLoading(rank.checkoutName)
                    ? "Processing..."
                    : "Purchase Rank"}
                </button>
                <Link
                  href={rank.link}
                  className="relative z-20 mt-3 block text-center text-[10px] text-white/35 transition-colors hover:text-white/70"
                  style={{ ["--rank-accent"]: rank.accent }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = rank.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                  }}
                >
                  view more details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div id="keys" className="mb-20 scroll-mt-24">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <h3 className="text-5xl font-black uppercase italic tracking-tighter">
              Crate <span className="text-purple-500">Keys</span>
            </h3>
            <div className="hidden h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent md:block" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {crateKeys.map((key) => (
              <motion.div
                layoutId={`crate-${key.tebexPackageId}`}
                key={key.name}
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
                    loading="lazy"
                    className="object-contain transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                    sizes="144px"
                  />
                </div>
                <h4
                  className={`mb-1 text-3xl font-black uppercase italic tracking-tighter ${key.color}`}
                >
                  {key.name}
                </h4>
                <p className="mb-6 font-mono text-xl font-black text-white/60">
                  {key.price}
                </p>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/50 transition-colors group-hover:text-white">
                  View Details
                </div>
              </motion.div>
            ))}
          </div>
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
              layoutId={`crate-${selectedCrate.tebexPackageId}`}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className={`relative z-10 w-full max-w-2xl overflow-hidden rounded-[4rem] border bg-[#0a0a0a] p-8 shadow-2xl md:p-16 ${selectedCrate.border}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedCrate(null)}
                className="absolute right-8 top-8 z-50 text-2xl font-black text-white/20 transition-colors hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 h-64 w-64 md:mb-10 md:h-80 md:w-80">
                  <Image
                    src={selectedCrate.crateImg}
                    alt={selectedCrate.name}
                    fill
                    className="object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                    sizes="(max-width: 768px) 256px, 320px"
                  />
                </div>
                <h2
                  className={`mb-4 text-4xl font-black uppercase italic tracking-tighter md:mb-6 md:text-6xl ${selectedCrate.color}`}
                >
                  {selectedCrate.name} Crate
                </h2>
                <p className="mb-8 max-w-lg text-sm leading-relaxed text-white/60 md:mb-12 md:text-base">
                  {selectedCrate.description}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    checkout(
                      selectedCrate.tebexPackageId,
                      selectedCrate.tebexName,
                      { price: selectedCrate.price },
                    );
                  }}
                  className="w-full rounded-3xl bg-white py-5 text-[12px] font-black uppercase tracking-[0.2em] text-black shadow-2xl transition-all hover:bg-purple-500 hover:text-white md:py-6"
                >
                  {isLoading(selectedCrate.tebexName)
                    ? "Generating Receipt..."
                    : `Purchase for ${selectedCrate.price}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

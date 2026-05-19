"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckout } from "@/context/CheckoutContext";
import { getStoreRankCards } from "@/data/monthly-ranks";

export default function RanksPage() {
  const { checkout, isLoading } = useCheckout();
  const [selectedCrate, setSelectedCrate] = useState(null);

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

  const crateKeys = [
    {
      name: "Common",
      price: "£1.19",
      color: "text-[#00FFFF]",
      border: "border-cyan-500/20",
      hover: "hover:border-cyan-500/50",
      glow: "shadow-cyan-500/10",
      id: "7446409",
      img: "/keys/common.png",
      crateImg: "/keys/commoncrate.png",
      description:
        "The essential starter key. Great for grabbing basic resources, iron tools, and entry-level supplies.",
    },
    {
      name: "Epic",
      price: "£3.59",
      color: "text-[#AA00AA]",
      border: "border-purple-500/20",
      hover: "hover:border-purple-500/50",
      glow: "shadow-purple-500/10",
      id: "7446412",
      img: "/keys/epic.png",
      crateImg: "/keys/epiccrate.png",
      description:
        "A major step up. Contains enchanted gear, rare blocks, and a high chance for valuable items.",
    },
    {
      name: "Rare",
      price: "£4.79",
      color: "text-[#FFAA00]",
      border: "border-yellow-500/20",
      hover: "hover:border-yellow-500/50",
      glow: "shadow-yellow-500/10",
      id: "7446415",
      img: "/keys/rare.png",
      crateImg: "/keys/rarecrate.png",
      description:
        "Hard to find, easy to love. Offers mid-tier custom enchants and exclusive cosmetic particles.",
    },
    {
      name: "Legendary",
      price: "£5.99",
      color: "text-[#FF5555]",
      border: "border-red-500/20",
      hover: "hover:border-red-500/50",
      glow: "shadow-red-500/10",
      id: "7446421",
      img: "/keys/legendary.png",
      crateImg: "/keys/legendarycrate.png",
      popular: true,
      description:
        "The gold standard of crates. Unlocks high-tier weaponry and server-wide boosters.",
    },
    {
      name: "Amethyst",
      price: "£6.99",
      color: "text-[#55FF55]",
      border: "border-green-500/20",
      hover: "hover:border-green-500/50",
      glow: "shadow-green-500/10",
      id: "7446423",
      img: "/keys/amethyst.png",
      crateImg: "/keys/amethystcrate.png",
      description:
        "Pure power. Focuses on late-game progression, offering top-tier armor sets and rare spawners.",
    },
    {
      name: "ZEDX+",
      price: "£12.99",
      color:
        "text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-pink-500",
      border: "border-pink-500/40",
      hover: "hover:border-pink-500/80",
      glow: "shadow-pink-500/20",
      id: "7446426",
      img: "/keys/zedx+.png",
      crateImg: "/keys/zedx+crate.png",
      description:
        "The ultimate crate experience. Includes a chance for the rarest ranks and unique items.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden p-6 font-sans text-white selection:bg-purple-500/30 md:p-12">
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

        <div className="mb-32 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {monthlyRanks.map((rank) => (
            <motion.div
              key={rank.name}
              className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
            >
              {rank.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-black shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${rank.accent}, #FF6600)`,
                    boxShadow: `0 4px 20px ${rank.accent}66`,
                  }}
                >
                  Most Popular
                </motion.div>
              )}
              <motion.div className="absolute -inset-[1.5px] overflow-hidden rounded-[2.6rem]">
                <motion.div
                  className="absolute inset-[-250%] animate-border-glow"
                  style={{ background: rank.borderGlow }}
                />
              </motion.div>
              <motion.div
                className="relative z-10 flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border bg-[#050208] p-8"
                style={{ borderColor: `${rank.accent}33` }}
              >
                <motion.div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${rank.accent}, transparent)`,
                  }}
                />
                <motion.div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${rank.color} opacity-[0.14] transition-opacity duration-500 group-hover:opacity-100`}
                />
                <motion.div className="relative mb-8">
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
                  <motion.div className="flex items-baseline gap-1">
                    <span className="font-mono text-5xl font-black tracking-tighter text-white">
                      {rank.price}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase"
                      style={{ color: rank.accentDim }}
                    >
                      {rank.period}
                    </span>
                  </motion.div>
                </motion.div>
                <ul className="relative mb-10 flex-1 space-y-3">
                  {rank.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-[10px] font-bold text-white/45 transition-colors group-hover:text-white/85"
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
                    checkout(rank.id, rank.name, {
                      price: rank.price + rank.period,
                    })
                  }
                  style={{ "--rank-accent": rank.accent }}
                  className="relative z-20 w-full rounded-2xl bg-white py-5 text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-[var(--rank-accent)] hover:text-white"
                >
                  {isLoading(rank.name) ? "Processing..." : "Purchase Rank"}
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
              </motion.div>
            </motion.div>
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
                layoutId={`crate-${key.id}`}
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
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 transition-colors group-hover:text-white">
                  View Details
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCrate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCrate(null)}
              className="absolute inset-0 bg-[#050208]/95 backdrop-blur-2xl"
            />
            <motion.div
              layoutId={`crate-${selectedCrate.id}`}
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
                    priority
                    unoptimized
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
                    checkout(selectedCrate.id, selectedCrate.name, {
                      price: selectedCrate.price,
                    });
                  }}
                  className="w-full rounded-3xl bg-white py-5 text-[12px] font-black uppercase tracking-[0.2em] text-black shadow-2xl transition-all hover:bg-purple-500 hover:text-white md:py-6"
                >
                  {isLoading(selectedCrate.name)
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

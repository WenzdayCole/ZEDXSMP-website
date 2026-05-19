"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useClientSnapshot } from "@/hooks/useClientSnapshot";

const DISCORD_LINK = "https://discord.com/invite/zedxsmp";
const SERVER_IP = "zedxsmp.fun";

export default function MainCanvas() {
  const [isCopied, setIsCopied] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const playerCount = useClientSnapshot(
    () => Math.floor(Math.random() * 20) + 12,
  );

  useEffect(() => {
    const hintTimer = setTimeout(() => setShowScrollHint(true), 3000);
    return () => clearTimeout(hintTimer);
  }, []);

  // Hide arrow when user actually scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setShowScrollHint(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let frameId;
    const handleMouseMove = (e) => {
      frameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const smpFeatures = useMemo(
    () => [
      { title: "Vanilla+", desc: "Pure survival with essential QoL tweaks." },
      { title: "No Grief", desc: "Advanced land claims to protect builds." },
      { title: "Economy", desc: "Player-driven shops and global trade." },
      { title: "Community", desc: "Active Discord and weekly events." },
    ],
    [],
  );

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden p-6 font-sans text-white selection:bg-[#a855f74d]">
      {/* --- DYNAMIC BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-150 h-150 rounded-full blur-[120px] will-change-transform"
          style={{
            background: "radial-gradient(circle, #a855f726 0%, #a855f700 70%)",
            transform: `translate3d(${mousePos.x - 300}px, ${mousePos.y - 300}px, 0)`,
          }}
        />

      </div>

      {/* --- HERO CONTENT --- */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full max-w-6xl py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6 flex items-center gap-2 bg-[#ffffff0d] border border-[#ffffff1a] px-4 py-1.5 rounded-full backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffffffb3]"
            suppressHydrationWarning
          >
            {playerCount != null
              ? `${playerCount} Visitors Online`
              : "Connecting…"}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-2 relative text-center"
        >
          <h1 className="text-[18vw] md:text-[12rem] font-black uppercase tracking-tighter leading-none select-none italic">
            ZEDX{" "}
            <span className="text-purple-500 drop-shadow-[0_0_30px_#a855f780]">
              SMP
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-[#d8b4fe99] font-medium tracking-[1.2em] uppercase mb-12 text-[10px] text-center ml-[1.2em]"
        >
          The ultimate multiplayer vanilla{" "}
          <span className="text-[#ffffffcc]">Experience</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-8"
        >
          <button
            onClick={copyIP}
            className={`group relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 backdrop-blur-md text-left active:scale-95 ${
              isCopied
                ? "border-green-500/50 bg-green-500/10"
                : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.1)]"
            }`}
          >
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 block">
              {isCopied ? "Success" : "IP Address"}
            </span>
            <span
              className={`text-2xl font-mono font-bold ${isCopied ? "text-green-400" : "text-white"}`}
            >
              {isCopied ? "✓ COPIED" : SERVER_IP.toUpperCase()}
            </span>
          </button>

          <Link
            href="/ranks"
            className="group relative overflow-hidden rounded-2xl bg-white text-black p-8 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
          >
            <span className="text-black/40 text-[10px] font-black uppercase tracking-widest mb-2 block">
              Premium
            </span>
            <span className="text-2xl font-black italic uppercase">
              Store →
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#5865f21a] border border-[#5865f24d] hover:bg-[#5865f233] rounded-2xl p-4 transition-all flex items-center justify-center gap-3 mb-12 backdrop-blur-sm"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5865F2] group-hover:text-white transition-colors">
              Join the Discord Community
            </span>
          </a>
          <nav className="flex items-center justify-center">
            <div className="flex gap-1 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] p-1 backdrop-blur-xl animate-nav-border-pulse">
              {["Rules", "Ranks", "Keys"].map((item) => {
                let path =
                  item === "Ranks"
                    ? "/ranks/about"
                    : item === "Keys"
                      ? "/ranks#keys"
                      : `/${item.toLowerCase()}`;
                return (
                  <Link
                    key={item}
                    href={path}
                    className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[rgba(255,255,255,0.4)] transition-colors duration-500 hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </nav>
        </motion.div>

        {/* --- SCROLL DOWN ARROW --- */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 flex flex-col items-center gap-2"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                Scroll Down
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-purple-500/50"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- FEATURES GRID --- */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-4xl py-32 border-t border-white/5"
      >
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Why Play <span className="text-purple-500">ZEDXSMP?</span>
          </h2>
          <p className="text-white/40 text-sm font-medium tracking-wide max-w-lg mx-auto leading-relaxed uppercase">
            A premium survival experience designed for players who value
            community and fair play.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smpFeatures.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] p-8 group hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.08)]"
            >
              <h3 className="text-purple-400 font-black uppercase tracking-widest text-xs mb-3 group-hover:text-purple-300">
                {f.title}
              </h3>
              <p className="text-[rgba(255,255,255,0.4)] text-[11px] font-bold uppercase leading-relaxed tracking-wide group-hover:text-[rgba(255,255,255,0.6)]">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full max-w-6xl py-12 flex flex-col items-center border-t border-white/5 gap-4">
        <button
          onClick={() => setIsTermsOpen(true)}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-purple-400 transition-colors"
        >
          Terms of Service
        </button>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10">
          © 2026 ZEDXSMP · The official website
        </p>
      </footer>

      {/* --- TERMS MODAL --- */}
      <AnimatePresence>
        {isTermsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setIsTermsOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-[#0c0c0e] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-black uppercase italic tracking-tighter">
                  Terms of Service
                </h2>
                <button
                  onClick={() => setIsTermsOpen(false)}
                  className="text-white/50 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
              <div className="p-8 overflow-y-auto text-[11px] leading-relaxed text-white/50 font-bold uppercase tracking-widest custom-scrollbar">
                <section>
                  <h3 className="text-white text-xs mb-3">
                    1. Acceptance of Terms
                  </h3>
                  <p>By accessing ZEDX SMP, you agree to these terms.</p>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

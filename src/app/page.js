"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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

  const [mouseGlow, setMouseGlow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setMouseGlow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!mouseGlow) return;
    let frameId = 0;
    const handleMouseMove = (e) => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [mouseGlow]);

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
      {mouseGlow && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute h-[600px] w-[600px] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #a855f726 0%, #a855f700 70%)",
              transform: `translate3d(${mousePos.x - 300}px, ${mousePos.y - 300}px, 0)`,
            }}
          />
        </div>
      )}

      {/* --- HERO CONTENT --- */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full max-w-6xl py-20">
        <div className="animate-hero-fade-up animate-delay-500 mb-6 flex items-center gap-2 rounded-full border border-[#ffffff1a] bg-[#ffffff0d] px-4 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80"
            suppressHydrationWarning
          >
            {playerCount != null
              ? `${playerCount} Visitors Online`
              : "Connecting…"}
          </span>
        </div>

        <div className="animate-hero-title-in relative mb-2 text-center">
          <h1 className="text-[18vw] md:text-[12rem] font-black uppercase tracking-tighter leading-none select-none italic">
            ZEDX{" "}
            <span className="text-purple-500 drop-shadow-[0_0_30px_#a855f780]">
              SMP
            </span>
          </h1>
        </div>

        <p className="animate-hero-fade-in animate-delay-800 mb-12 ml-[1.2em] text-center text-[10px] font-medium uppercase tracking-[1.2em] text-purple-200">
          The ultimate multiplayer vanilla{" "}
          <span className="text-white">Experience</span>
        </p>

        <div className="animate-hero-fade-up animate-delay-1000 mb-8 grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
          <button
            onClick={copyIP}
            className={`group relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 backdrop-blur-md text-left active:scale-95 ${
              isCopied
                ? "border-green-500/50 bg-green-500/10"
                : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.1)]"
            }`}
          >
            <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-white/60">
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
            <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-black/70">
              Premium
            </span>
            <span className="text-2xl font-black italic uppercase">
              Store →
            </span>
          </Link>
        </div>

        <div className="animate-hero-fade-up animate-delay-1200 w-full max-w-2xl">
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#5865f21a] border border-[#5865f24d] hover:bg-[#5865f233] rounded-2xl p-4 transition-all flex items-center justify-center gap-3 mb-12 backdrop-blur-sm"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 transition-colors group-hover:text-white">
              Join the Discord Community
            </span>
          </a>
          <nav className="flex items-center justify-center">
            <div className="relative flex gap-1 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur-xl">
              <span
                className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-purple-400/50 animate-nav-ring-pulse"
                aria-hidden
              />
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
                    className="relative z-10 rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/70 transition-colors duration-500 hover:bg-white/10 hover:text-white"
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* --- SCROLL DOWN ARROW --- */}
        {showScrollHint && (
          <div className="animate-hero-fade-in absolute bottom-10 flex flex-col items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/75">
              Scroll Down
            </span>
            <div className="animate-scroll-hint-bounce text-purple-300">
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
            </div>
          </div>
        )}
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="relative z-10 w-full max-w-4xl border-t border-white/5 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Why Play <span className="text-purple-500">ZEDXSMP?</span>
          </h2>
          <p className="mx-auto max-w-lg text-sm font-medium uppercase leading-relaxed tracking-wide text-white/60">
            A premium survival experience designed for players who value
            community and fair play.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smpFeatures.map((f, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] p-8 transition-transform duration-300 hover:scale-[1.02] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.08)]"
            >
              <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-purple-300 group-hover:text-purple-200">
                {f.title}
              </h3>
              <p className="text-[11px] font-bold uppercase leading-relaxed tracking-wide text-white/60 group-hover:text-white/80">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full max-w-6xl py-12 flex flex-col items-center border-t border-white/5 gap-4">
        <button
          onClick={() => setIsTermsOpen(true)}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-purple-400"
        >
          Terms of Service
        </button>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/65">
          © 2026 ZEDXSMP · The official website
        </p>
      </footer>

      {/* --- TERMS MODAL --- */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-[100] flex animate-hero-fade-in items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setIsTermsOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            className="animate-hero-fade-up relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-2xl"
          >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2
                  id="terms-title"
                  className="text-xl font-black uppercase italic tracking-tighter"
                >
                  Terms of Service
                </h2>
                <button
                  onClick={() => setIsTermsOpen(false)}
                  className="text-white/50 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
              <div className="custom-scrollbar overflow-y-auto p-8 text-[11px] font-bold uppercase leading-relaxed tracking-widest text-white/65">
                <section>
                  <h3 className="text-white text-xs mb-3">
                    1. Acceptance of Terms
                  </h3>
                  <p>By accessing ZEDX SMP, you agree to these terms.</p>
                </section>
              </div>
          </div>
        </div>
      )}
    </main>
  );
}

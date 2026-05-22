"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useClientSnapshot } from "@/hooks/useClientSnapshot";

const DISCORD_LINK = "https://discord.com/invite/zedxsmp";
const SERVER_IP = "zedxsmp.fun";

export default function HomePageClient() {
  const [isCopied, setIsCopied] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseGlow, setMouseGlow] = useState(false);
  const playerCount = useClientSnapshot(
    () => Math.floor(Math.random() * 20) + 12,
  );

  useEffect(() => {
    const hintTimer = setTimeout(() => setShowScrollHint(true), 3000);
    return () => clearTimeout(hintTimer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setShowScrollHint(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <>
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

      <div className="animate-hero-fade-up animate-delay-500 mb-6 flex items-center gap-2 rounded-full border border-[#ffffff1a] bg-[#ffffff0d] px-4 py-1.5 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
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

      <div className="animate-hero-fade-up animate-delay-1000 mb-8 grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        <button
          type="button"
          onClick={copyIP}
          className={`group relative overflow-hidden rounded-2xl border p-8 text-left backdrop-blur-md transition-all duration-300 active:scale-95 ${
            isCopied
              ? "border-green-500/50 bg-green-500/10"
              : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.1)]"
          }`}
        >
          <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-white/60">
            {isCopied ? "Success" : "IP Address"}
          </span>
          <span
            className={`font-mono text-2xl font-bold ${isCopied ? "text-green-400" : "text-white"}`}
          >
            {isCopied ? "✓ COPIED" : SERVER_IP.toUpperCase()}
          </span>
        </button>

        <Link
          href="/ranks"
          className="group relative overflow-hidden rounded-2xl bg-white p-8 text-black transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
        >
          <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-black/70">
            Premium
          </span>
          <span className="text-2xl font-black uppercase italic">Store →</span>
        </Link>
      </div>

      <div className="animate-hero-fade-up animate-delay-1200 w-full max-w-2xl">
        <a
          href={DISCORD_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group mb-12 flex items-center justify-center gap-3 rounded-2xl border border-[#5865f24d] bg-[#5865f21a] p-4 backdrop-blur-sm transition-all hover:bg-[#5865f233]"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 transition-colors group-hover:text-white">
            Join the Discord Community
          </span>
        </a>
        <nav className="flex items-center justify-center">
          <div className="relative flex gap-1 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur-xl">
            <span
              className="pointer-events-none absolute inset-0 animate-nav-ring-pulse rounded-full ring-1 ring-purple-400/50"
              aria-hidden
            />
            {["Rules", "Ranks", "Keys"].map((item) => {
              const path =
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

      {showScrollHint && (
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.3em] text-white">
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
              aria-hidden
            >
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </div>
      )}

    </>
  );
}

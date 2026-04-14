"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const DISCORD_LINK = "https://discord.com/invite/SxZphvVN3j";
const SERVER_IP = "zedxsmp.fun";

export default function MainCanvas() {
  const [isCopied, setIsCopied] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    const createStars = (count) => {
      return Array.from({ length: count })
        .map(() => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const opacity = Math.random() * 0.7 + 0.3;
          return `${x}vw ${y}vh rgba(255, 255, 255, ${opacity})`;
        })
        .join(", ");
    };

    const dataTimer = setTimeout(() => {
      setClientData({
        playerCount: Math.floor(Math.random() * 20) + 12,
        stars: {
          slow: createStars(150),
          mid: createStars(100),
          fast: createStars(50),
        },
      });
    }, 100);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(dataTimer);
    };
  }, []);

  const copyIP = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(SERVER_IP);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const smpFeatures = useMemo(
    () => [
      { title: "Vanilla+", desc: "Pure survival with essential QoL tweaks." },
      {
        title: "No Grief",
        desc: "Advanced land claims to protect your builds.",
      },
      { title: "Economy", desc: "Player-driven shops and global trade." },
      { title: "Community", desc: "Active Discord and weekly server events." },
    ],
    [],
  );

  // Hydration Shield
  if (!isMounted) {
    return <main className="min-h-screen bg-[#050208]" />;
  }

  return (
    <main className="min-h-screen bg-[#050208] text-white flex flex-col items-center p-6 relative overflow-x-hidden font-sans selection:bg-purple-500/30">
      {/* Background Stars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: clientData ? 1 : 0 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        {clientData && (
          <>
            <div
              style={{ boxShadow: clientData.stars.slow }}
              className="absolute w-px h-px bg-transparent animate-parallax-infinite"
            />
            <div
              style={{ boxShadow: clientData.stars.mid }}
              className="absolute w-0.5 h-0.5 bg-transparent animate-parallax-infinite [animation-duration:80s]"
            />
            <div
              style={{ boxShadow: clientData.stars.fast }}
              className="absolute w-0.75 h-0.75 bg-transparent animate-parallax-infinite [animation-duration:40s]"
            />
          </>
        )}
      </motion.div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full max-w-6xl py-20">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6 flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
            {clientData
              ? `${clientData.playerCount} Players Online`
              : "Connecting..."}
          </span>
        </motion.div>

        {/* Logo Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-2 relative text-center"
        >
          <h1
            className="text-[18vw] md:text-[12rem] font-black uppercase tracking-tighter leading-none select-none italic"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.05)",
              textShadow: "0 0 60px rgba(168, 85, 247, 0.4)",
            }}
          >
            ZEDX{" "}
            <span className="text-purple-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">
              SMP
            </span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-purple-300/60 font-medium tracking-[1.2em] uppercase mb-12 text-[10px] text-center ml-[1.2em]"
        >
          The ultimate multiplayer vanilla{" "}
          <span className="text-white/80">Experience</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-8"
        >
          <button
            onClick={copyIP}
            className={`group relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 backdrop-blur-md text-left active:scale-95 ${isCopied ? "border-green-500/50 bg-green-500/10" : "border-white/10 bg-white/5 hover:border-white/40 hover:bg-white/10"}`}
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
            className="group relative overflow-hidden rounded-2xl bg-white text-black p-8 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <span className="text-black/40 text-[10px] font-black uppercase tracking-widest mb-2 block">
              Premium
            </span>
            <span className="text-2xl font-black italic uppercase">
              Store →
            </span>
          </Link>
        </motion.div>

        {/* Discord & Nav */}
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
            className="group bg-[#5865F2]/10 border border-[#5865F2]/30 hover:bg-[#5865F2]/20 rounded-2xl p-4 transition-all flex items-center justify-center gap-3 mb-12 backdrop-blur-sm"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5865F2] group-hover:text-white transition-colors">
              Join the Discord Community
            </span>
          </a>
          <nav className="flex items-center justify-center">
            <div className="flex gap-1 p-1 bg-white/3 border border-white/10 rounded-full backdrop-blur-xl animate-pulse-slow">
              {["Rules", "Ranks"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white hover:bg-white/5 transition-all duration-500"
                >
                  {item}
                </Link>
              ))}
            </div>
          </nav>
        </motion.div>
      </section>

      {/* Features Section */}
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
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
              className="bg-white/2 border border-white/5 p-8 rounded-3xl transition-colors group"
            >
              <h3 className="text-purple-400 font-black uppercase tracking-widest text-xs mb-3 group-hover:text-purple-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-white/40 text-[11px] font-bold uppercase leading-relaxed tracking-wide group-hover:text-white/60">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
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

      {/* Modal */}
      <AnimatePresence>
        {isTermsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
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
                  className="text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-8 overflow-y-auto text-[11px] leading-relaxed text-white/50 font-bold uppercase tracking-widest custom-scrollbar">
                <div className="space-y-8">
                  <section>
                    <h3 className="text-white text-xs mb-3">
                      1. Acceptance of Terms
                    </h3>
                    <p>By accessing ZEDX SMP, you agree to these terms...</p>
                  </section>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes parallax-infinite {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100vh);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            border-color: rgba(255, 255, 255, 0.1);
          }
          50% {
            border-color: rgba(168, 85, 247, 0.4);
          }
        }
        .animate-parallax-infinite {
          animation: parallax-infinite 120s linear infinite;
          filter: drop-shadow(0 100vh 0 white);
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}

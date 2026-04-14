"use client";
import { useMemo, useSyncExternalStore, useState } from "react";
import Link from "next/link";

// --- HYDRATION HELPER ---
const subscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export default function RanksPage() {
  const isMounted = useIsMounted();
  const [loadingId, setLoadingId] = useState(null);

  // Checkout handler
  const handleCheckout = async (priceId, itemName) => {
    if (!priceId || priceId.includes("REPLACE")) {
      alert("Please add the real Price ID for this item!");
      return;
    }
    setLoadingId(itemName);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout Error: " + data.error);
      }
    } catch (err) {
      alert("Network error. Make sure your server is running!");
    } finally {
      setLoadingId(null);
    }
  };

  const starLayers = useMemo(() => {
    if (!isMounted) return { slow: "", mid: "" };
    function createStars(count) {
      return Array.from({ length: count })
        .map(() => {
          // FIXED: Increased to 4000px to cover ultra-wide monitors
          const x = Math.floor(Math.random() * 4000);
          const y = Math.floor(Math.random() * 4000);
          const opacity = Math.random() * 0.7 + 0.3;
          return `${x}px ${y}px rgba(255, 255, 255, ${opacity})`;
        })
        .join(", ");
    }
    return { slow: createStars(200), mid: createStars(150) };
  }, [isMounted]);

  const monthlyRanks = [
    {
      name: "VIP",
      slug: "vip",
      title: "The Foundation",
      description: "Essential utility and a permanent edge.",
      price: "£4.99",
      period: "/mo",
      color: "from-[#FFFF00]/80 to-[#FFFF00]/20",
      features: [
        "Yellow Name Tag",
        "Access to /heal",
        "1.2x Shard Multiplier",
        "Basic Kit",
      ],
    },
    {
      name: "MVP",
      slug: "mvp",
      title: "The Elite Standard",
      description: "Superior utility and prestige.",
      price: "£9.99",
      period: "/mo",
      color: "from-[#FFAA00]/80 to-[#FFAA00]/20",
      features: [
        "Golden Name Tag",
        "Access to /feed",
        "1.5x Shard Multiplier",
        "MVP Daily Crate",
      ],
      popular: true,
    },
    {
      name: "ZEDX",
      slug: "zedx",
      title: "The Champion Tier",
      description: "Unmatched power. Access high-tier utility.",
      price: "£14.99",
      period: "/mo",
      color: "from-[#00C3FF]/80 to-[#00C3FF]/20",
      features: [
        "Light Blue Name Tag",
        "Access to /workbench",
        "1.8x Shard Multiplier",
        "Discord Role",
      ],
    },
    {
      name: "ZEDX+",
      slug: "zedx-plus",
      title: "The Infinite Tier",
      description: "Total freedom. Creative flight and ultimate power.",
      price: "£19.99",
      period: "/mo",
      color: "from-cyan-400/40 to-pink-500/40",
      features: [
        "Bold Light Blue Tag",
        "Pink '+' Symbol",
        "2.0x Shard Multiplier",
        "Creative Flight (/fly)",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#050208] text-white p-6 md:p-12 relative overflow-x-hidden font-sans">
      {/* FIXED Background FX Container */}
      <div className="fixed inset-0 pointer-events-none z-0 w-screen h-screen overflow-hidden">
        {isMounted && (
          <>
            <div
              style={{ boxShadow: starLayers.slow }}
              className="absolute w-px h-px bg-transparent animate-parallax-slow opacity-30"
            />
            <div
              style={{ boxShadow: starLayers.mid }}
              className="absolute w-0.5 h-0.5 bg-transparent animate-parallax-mid opacity-50"
            />
          </>
        )}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-20 text-center md:text-left">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-all"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Back to Home
          </Link>
          <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter mt-4 leading-none">
            Server <span className="text-purple-500">Store</span>
          </h1>
        </header>

        {/* --- MAIN RANKS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {monthlyRanks.map((rank) => (
            <div
              key={rank.name}
              className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
            >
              {rank.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 bg-purple-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  Most Popular
                </div>
              )}

              {/* Border Chase FX */}
              <div className="absolute -inset-[2.5px] rounded-[2.6rem] overflow-hidden">
                <div className="absolute inset-[-250%] animate-border-glow" />
              </div>

              <div className="relative z-10 flex-1 bg-[#050208] rounded-[2.5rem] p-8 border border-white/5 flex flex-col overflow-hidden">
                <div
                  className={`absolute inset-0 bg-linear-to-br ${rank.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
                <div className="relative mb-8">
                  <span className="text-purple-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2 block">
                    {rank.title}
                  </span>
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">
                    {rank.name}
                  </h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-mono font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                      {rank.price}
                    </span>
                    <span className="text-white/30 text-[10px] font-bold uppercase">
                      {rank.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-10 relative">
                  {rank.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[10px] font-bold text-white/40 group-hover:text-white/80 transition-colors"
                    >
                      <div className="mt-1 w-1 h-1 rounded-full bg-white/20 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/ranks/about#${rank.slug}`}
                  className="relative z-20 w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-center text-[10px] transition-all duration-300 bg-white text-black hover:bg-purple-500 hover:text-white"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* --- CURRENCY & SHARDS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 mb-32">
          {/* Cash Section */}
          <div className="space-y-8">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-green-500 text-center lg:text-left px-2">
              In-Game Money
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { n: "$1,000", p: "£1.00", id: "price_1" },
                { n: "$10,000", p: "£8.00", id: "price_2" },
                { n: "$50,000", p: "£35.00", id: "price_3" },
                { n: "$100,000", p: "£65.00", id: "price_4" },
              ].map((item) => (
                <div
                  key={item.n}
                  className="bg-white/3 border border-white/10 p-8 rounded-[2.5rem] hover:border-green-500/40 transition-all group relative overflow-hidden"
                >
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">
                    Cash Pack
                  </p>
                  <h4 className="text-4xl font-black italic mb-6 text-white">
                    {item.n}
                  </h4>
                  <div className="text-3xl font-mono font-black text-white/90 mb-6">
                    {item.p}
                  </div>
                  <button
                    onClick={() => handleCheckout(item.id, item.n)}
                    className="w-full py-4 bg-green-500/10 border border-green-500/20 rounded-xl text-[10px] font-black uppercase text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all"
                  >
                    {loadingId === item.n ? "..." : "Buy Now"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Shards Section */}
          <div className="space-y-8">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-pink-500 text-center lg:text-left px-2">
              ZEDX Shards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { n: "100 Shards", p: "£1.50", id: "shard_1" },
                { n: "500 Shards", p: "£6.50", id: "shard_2" },
                { n: "2,500 Shards", p: "£30.00", id: "shard_3" },
                { n: "10,000 Shards", p: "£100.00", id: "shard_4" },
              ].map((item) => (
                <div
                  key={item.n}
                  className="bg-white/3 border border-white/10 p-8 rounded-[2.5rem] hover:border-pink-500/40 transition-all group relative overflow-hidden"
                >
                  <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1">
                    Shard Pack
                  </p>
                  <h4 className="text-4xl font-black italic mb-6 text-pink-50">
                    {item.n}
                  </h4>
                  <div className="text-3xl font-mono font-black text-white/90 mb-6">
                    {item.p}
                  </div>
                  <button
                    onClick={() => handleCheckout(item.id, item.n)}
                    className="w-full py-4 bg-pink-500/10 border border-pink-500/20 rounded-xl text-[10px] font-black uppercase text-pink-500 group-hover:bg-pink-500 group-hover:text-black transition-all shadow-pink-500/10 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                  >
                    {loadingId === item.n ? "..." : "Buy Now"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes border-chase {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-border-glow {
          background: conic-gradient(
            from 90deg at 50% 50%,
            rgba(0, 242, 255, 0) 0%,
            #00f2ff 15%,
            #7000ff 30%,
            #ff00c8 45%,
            rgba(0, 242, 255, 0) 60%
          );
          animation: border-chase 4s linear infinite;
        }
        @keyframes parallax {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-1000px);
          }
        }
        .animate-parallax-slow {
          animation: parallax 120s linear infinite;
        }
        .animate-parallax-mid {
          animation: parallax 70s linear infinite;
        }
        body {
          background: #050208;
          margin: 0;
          overflow-x: hidden;
        }
      `}</style>
    </main>
  );
}

"use client";
import React, { useMemo, useSyncExternalStore, useState } from "react";
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

export default function AboutPage() {
  const isMounted = useIsMounted();
  const [loadingId, setLoadingId] = useState(null);

  const handleCheckout = async (priceId, rankName) => {
    if (!priceId || priceId.includes("REPLACE")) {
      alert("Please add the real Price ID for this item!");
      return;
    }
    setLoadingId(rankName);
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
          const x = Math.floor(Math.random() * 2000);
          const y = Math.floor(Math.random() * 2000);
          const opacity = Math.random() * 0.7 + 0.3;
          return `${x}px ${y}px rgba(255, 255, 255, ${opacity})`;
        })
        .join(", ");
    }
    return { slow: createStars(150), mid: createStars(100) };
  }, [isMounted]);

  const rankDetails = [
    {
      id: "vip",
      name: "VIP",
      tagline: "COAL TIER FOUNDATION",
      price: "£4.99",
      priceId: "price_1TL2E1Ju3HDD8mZsL6DvEtuW",
      color: "#FFFF55",
      description:
        "The VIP rank provides the essential tools for any serious survivalist. It focuses on inventory management and basic automation to keep you in the mines longer.",
      commands: ["/back", "/clearinventory", "/near", "/condense"],
      perks: [
        "Homes: Set up to 5 locations",
        "Auctions: List 5 items simultaneously",
        "Keep XP: Never lose levels on death",
        "Vaults: 1 Private Vault (/pv 1)",
        "Colored Signs: Use color codes",
        "RTP: 1 Minute Cooldown",
      ],
      kit: {
        name: "Coal Kit",
        cooldown: "7 Days",
        items: [
          "Full Iron Armor (Unbreaking I)",
          "Iron Toolset (Unbreaking I)",
          "4x Protection I Books",
          "1x Sharpness I / Efficiency I Books",
          "128x Experience Bottles",
          "64x Steak & 8x Golden Apples",
        ],
      },
    },
    {
      id: "mvp",
      name: "MVP",
      tagline: "IRON TIER ELITE",
      price: "£9.99",
      priceId: "REPLACE_WITH_MVP_ID",
      color: "#FFAA00",
      popular: true,
      description:
        "MVP is designed for the combat-heavy player. With portable furnaces and spawner mining, you can set up shop anywhere in the world and stay there indefinitely.",
      commands: ["/feed", "/furnace", "/condense", "/recipe", "/repair"],
      perks: [
        "Homes: Set up to 10 locations",
        "Auctions: List 10 items simultaneously",
        "Join Full Server: Guaranteed access",
        "Spawners: Mine with Silk Touch",
        "Vaults: 3 Private Vaults (/pv 1-3)",
        "RTP: 30 Second Cooldown",
      ],
      kit: {
        name: "Iron Kit",
        cooldown: "5 Days",
        items: [
          "Full Diamond Armor (Protection II)",
          "Diamond Toolset (Efficiency III)",
          "4x Protection III Books",
          "1x Sharpness III / Fortune II Books",
          "256x Experience Bottles",
          "64x Cooked Pork & 16x Golden Apples",
        ],
      },
    },
    {
      id: "zedx",
      name: "ZEDX",
      tagline: "GOLD TIER CHAMPION",
      price: "£14.99",
      priceId: "REPLACE_WITH_ZEDX_ID",
      color: "#00C3FF",
      description:
        "The ZEDX rank offers ultimate portability. Access your crafting table and vaults from anywhere, and enjoy the highest survival utility available.",
      commands: [
        "/craft",
        "/pv",
        "/repair all",
        "/enderchest",
        "/fly (Lobby Only)",
      ],
      perks: [
        "Homes: Set up to 25 locations",
        "Auctions: List 20 items simultaneously",
        "Spawners: Mine WITHOUT Silk Touch",
        "Vaults: 10 Private Vaults (/pv 1-10)",
        "RTP: Instant (No Cooldown)",
        "Chat: Access to HEX Color Codes",
      ],
      kit: {
        name: "Gold Kit",
        cooldown: "3 Days",
        items: [
          "Full Diamond Armor (Protection IV)",
          "Diamond Toolset (Efficiency V / Fortune III)",
          "4x Protection IV Books",
          "1x Sharpness V / Silk Touch Books",
          "512x Experience Bottles",
          "32x Enchanted Golden Apples",
        ],
      },
    },
    {
      id: "zedx-plus",
      name: "ZEDX+",
      tagline: "NETHERITE TIER DEITY",
      price: "£19.99",
      priceId: "REPLACE_WITH_ZEDXPLUS_ID",
      color: "#FF55FF",
      description:
        "The peak of existence. ZEDX+ grants you the powers of a god, including full survival flight and access to the server's most protected vaults and kits.",
      commands: ["/fly (Everywhere)", "/god", "/heal", "/fix all", "/rename"],
      perks: [
        "Homes: Unlimited locations",
        "Auctions: List 50 items simultaneously",
        "Vaults: 50 Private Vaults (/pv 1-50)",
        "Anti-Grief: Priority protection",
        "Disposal Signs: Create [Disposal]",
        "Exclusive: Bold Blue Tag + Pink '+'",
      ],
      kit: {
        name: "Netherite Kit",
        cooldown: "48 Hours",
        items: [
          "Full Netherite Armor (Protection V)",
          "Netherite Toolset (Eff VII / Fortune IV)",
          "8x Protection V / Sharpness VI Books",
          "4x Mending / Unbreaking IV Books",
          "2048x Experience Bottles",
          "64x Enchanted Golden Apples",
        ],
      },
    },
  ];

  return (
    <main className="min-h-screen bg-[#050208] text-white font-sans selection:bg-purple-500/30">
      {/* Background Star FX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {isMounted && (
          <>
            <div
              style={{ boxShadow: starLayers.slow }}
              className="absolute w-px h-px bg-transparent animate-parallax-slow opacity-20"
            />
            <div
              style={{ boxShadow: starLayers.mid }}
              className="absolute w-0.5 h-0.5 bg-transparent animate-parallax-mid opacity-40"
            />
          </>
        )}
      </div>

      {/* Sticky Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#050208]/80 backdrop-blur-lg border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/ranks"
            className="font-black italic text-xl tracking-tighter uppercase group"
          >
            <span className="text-purple-500 group-hover:text-white transition-colors">
              ←
            </span>{" "}
            BACK TO STORE
          </Link>
          <div className="hidden md:flex gap-6 uppercase text-[10px] font-black tracking-widest text-white/40">
            {rankDetails.map((r) => (
              <a
                key={r.id}
                href={`#${r.id}`}
                className="hover:text-white transition-colors"
              >
                {r.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-4">
          RANK <span className="text-purple-500">INTEL</span>
        </h1>
        <p className="max-w-2xl mx-auto text-white/40 text-[10px] uppercase tracking-[0.4em] font-black">
          Command Access • Economic Perks • God-Tier Kits
        </p>
      </section>

      {/* Detailed Sections */}
      <div className="relative z-10">
        {rankDetails.map((rank) => (
          <section
            key={rank.id}
            id={rank.id}
            className="py-24 border-t border-white/5 scroll-mt-20"
          >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Left Column: Core Info */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className="text-[10px] font-black uppercase tracking-[0.4em] px-3 py-1 bg-white/5 rounded-full inline-block"
                      style={{ color: rank.color }}
                    >
                      {rank.tagline}
                    </span>
                    {rank.popular && (
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] px-3 py-1 bg-purple-600 rounded-full inline-block">
                        MOST POPULAR
                      </span>
                    )}
                  </div>
                  <h2 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                    {rank.name}
                  </h2>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    {rank.description}
                  </p>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10">
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-6xl font-mono font-black">
                      {rank.price}
                    </span>
                    <span className="text-white/20 text-xs font-bold uppercase tracking-widest">
                      / Monthly
                    </span>
                  </div>
                  <button
                    onClick={() => handleCheckout(rank.priceId, rank.name)}
                    className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] hover:bg-purple-500 hover:text-white transition-all transform active:scale-95 shadow-xl"
                  >
                    {loadingId === rank.name
                      ? "PROCESSING..."
                      : `PURCHASE ${rank.name}`}
                  </button>
                </div>
              </div>

              {/* Right Column: Technical Grid */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Commands */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <h4 className="text-purple-500 text-[10px] font-black uppercase tracking-widest mb-4">
                      Commands
                    </h4>
                    <ul className="space-y-2">
                      {rank.commands.map((cmd) => (
                        <li
                          key={cmd}
                          className="text-xs font-mono text-white/60 flex items-center gap-2"
                        >
                          <span className="text-purple-400 font-bold">
                            {">"}
                          </span>{" "}
                          {cmd}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Perks */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                    <h4 className="text-purple-500 text-[10px] font-black uppercase tracking-widest mb-4">
                      Core Perks
                    </h4>
                    <ul className="space-y-2">
                      {rank.perks.map((perk) => (
                        <li
                          key={perk}
                          className="text-[11px] font-bold text-white/60 flex items-center gap-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-white/20" />{" "}
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Kit Display */}
                <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <h3 className="text-8xl font-black italic uppercase tracking-tighter"></h3>
                  </div>
                  <div className="relative z-10">
                    <div className="mb-6">
                      <h4
                        className="text-3xl font-black italic uppercase tracking-tight mb-1"
                        style={{ color: rank.color }}
                      >
                        {rank.kit.name}
                      </h4>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                        Usable every {rank.kit.cooldown}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      {rank.kit.items.map((item, i) => (
                        <div
                          key={i}
                          className="text-[11px] font-bold text-white/70 flex items-center gap-3 py-1.5 border-b border-white/5"
                        >
                          <span className="text-purple-500">✦</span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="py-32 text-center border-t border-white/5">
        <Link
          href="/ranks"
          className="text-white/20 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.5em] group"
        >
          <span className="inline-block group-hover:-translate-x-2 transition-transform mr-4">
            ←
          </span>
          Return to Store Overview
        </Link>
      </footer>

      <style jsx global>{`
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
        html {
          scroll-behavior: smooth;
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

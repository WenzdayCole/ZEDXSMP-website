"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RulesPage() {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const createStars = (count) => {
        return Array.from({ length: count })
          .map(() => {
            const x = Math.floor(Math.random() * 2000);
            const y = Math.floor(Math.random() * 2000);
            const opacity = Math.random() * 0.7 + 0.3;
            return `${x}px ${y}px rgba(255, 255, 255, ${opacity})`;
          })
          .join(", ");
      };

      setClientData({
        stars: {
          slow: createStars(150),
          mid: createStars(100),
          fast: createStars(50),
        },
      });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const ruleSections = [
    {
      title: "Illegal Client Mods",
      description:
        "Any modification that gives an unfair advantage is strictly prohibited.",
      rules: [
        "Hacked Clients & Movement Mods",
        "X-Ray, ESP, & Radar",
        "Freecam & Inventory Mods",
        "Auto-Clickers & Macros/Scripts",
        "Auto-Place & Easy-Place Mods",
        "Health Indicators & Seed Finding",
      ],
    },
    {
      title: "Fair Gameplay",
      description:
        "Respect the grind. Play the game as it was intended to be played.",
      rules: [
        "No Abusing Bugs or Glitches",
        "No Item Duplication (of any kind)",
        "No Alt Accounts (One account per player)",
        "No Mouse Tweaks or Scrollers",
        "No Crafting Modifications",
        "Report all cheaters immediately",
      ],
    },
    {
      title: "Community & Economy",
      description:
        "Keep the server healthy. Real-world trading is a permanent ban.",
      rules: [
        "No IRL Trading (Real money for items)",
        "No External Gambling or Rewards",
        "No Cross-Server Trading",
        "No Staff Impersonation",
        "No Voice Chat Spamming",
        "No Discord Invite/Boost Rewards",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#050208] text-white p-4 md:p-12 lg:p-20 relative overflow-x-hidden font-sans selection:bg-purple-500/30">
      {/* Background Stars matching Home Page */}
      <div className="absolute inset-0 pointer-events-none">
        {clientData && (
          <>
            <div
              style={{ boxShadow: clientData.stars.slow }}
              className="absolute w-px h-px bg-transparent animate-parallax-slow opacity-40"
            />
            <div
              style={{ boxShadow: clientData.stars.mid }}
              className="absolute w-0.5 h-0.5 bg-transparent animate-parallax-mid opacity-60"
            />
            <div
              style={{ boxShadow: clientData.stars.fast }}
              className="absolute w-1 h-1 bg-transparent animate-parallax-fast opacity-20"
            />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <header className="mb-16 md:mb-24">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-purple-500 text-sm font-black uppercase tracking-[0.4em] hover:text-white transition-all duration-300 mb-8"
          >
            <span className="group-hover:-translate-x-2 transition-transform">
              ←
            </span>{" "}
            Back to Home
          </Link>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] mb-6">
            THE <span className="text-purple-500">RULES</span>
          </h1>
          <p className="text-white/40 font-bold tracking-[0.5em] uppercase text-xs md:text-sm"></p>
        </header>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {ruleSections.map((section, idx) => (
            <div
              key={section.title}
              className={`group bg-white/2 border border-white/10 rounded-4xl md:rounded-[3rem] p-8 md:p-14 backdrop-blur-3xl hover:bg-white/4 hover:border-white/20 transition-all duration-500 ${idx === 2 ? "lg:col-span-2" : ""}`}
            >
              <div className="mb-12">
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white group-hover:text-purple-400 transition-colors">
                  {section.title}
                </h2>
                <div className="h-1 w-20 bg-purple-500 mt-4 mb-4 rounded-full group-hover:w-32 transition-all duration-500" />
                <p className="text-white/30 text-sm md:text-base font-medium max-w-xl">
                  {section.description}
                </p>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
                {section.rules.map((rule) => (
                  <li
                    key={rule}
                    className="flex items-start gap-4 text-base md:text-xl font-bold text-white/50 group-hover:text-white/90 transition-colors"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-2 shadow-[0_0_15px_rgba(168,85,247,0.8)] shrink-0" />
                    <span className="leading-tight uppercase tracking-tight">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Warning */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-4xl p-10 text-center backdrop-blur-sm">
          <p className="text-purple-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
            Ignorance of these rules is not an excuse for breaking them.
          </p>
        </div>
      </div>

      <footer className="relative z-10 w-full max-w-6xl py-20 flex flex-col items-center border-t border-white/5 mt-20 mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">
          © 2026 ZEDXSMP · System Protocol Active
        </p>
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
        .animate-parallax-fast {
          animation: parallax 40s linear infinite;
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

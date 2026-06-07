import HomePageClient from "@/app/components/HomePageClient";
import HomeHeroSticker from "@/app/components/HomeHeroSticker";
import HomeVisitorsOnline from "@/app/components/HomeVisitorsOnline";
import HomePromoImage from "@/app/components/HomePromoImage";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  alternates: { canonical: "/" },
};

const FEATURE_ENTER_DELAYS = [
  "animate-delay-1500",
  "animate-delay-1600",
  "animate-delay-1700",
  "animate-delay-1800",
  "animate-delay-1900",
  "animate-delay-2000",
];

const SMP_FEATURES = [
  {
    title: "Vanilla+",
    desc: "Pure survival with essential quality-of-life tweaks — no game-breaking mods, just a smoother grind.",
    points: [
      "Random teleport, homes, and warps to explore freely",
      "Balanced gameplay that stays true to Minecraft",
      "Active development with regular updates",
    ],
  },
  {
    title: "Economy",
    desc: "A full player-driven economy built for trading, selling, and climbing the leaderboards.",
    points: [
      "/shop, /ah, and player orders to buy and sell items",
      "Pay other players, check balances, and track item worth",
      "Coin flips and wagers for high-stakes PvP battles",
    ],
  },
  {
    title: "Community",
    desc: "A welcoming server with an active Discord and regular events for every type of player.",
    points: [
      "Weekly events and server-wide activities",
      "Proximity voice chat — talk to players near you in-game",
      "Friendly staff and a zero-tolerance rule set for cheaters",
    ],
  },
  {
    title: "PvP & Combat",
    desc: "Jump into dedicated PvP zones, place bounties, and test your skills against other players.",
    points: [
      "/pvp teleports you straight to the arena",
      "Bounty system to hunt wanted players for rewards",
      "Fair combat with clear rules — no hacked clients",
    ],
  },
  {
    title: "Ranks & Perks",
    desc: "Optional monthly ranks that unlock homes, auction slots, and exclusive commands.",
    points: [
      "VIP, MVP, and ZEDX+ tiers with in-game name tags",
      "More homes, AH listings, and QoL commands per rank",
      "Crate keys and cosmetics available in the store",
    ],
  },
  {
    title: "Teams & Progress",
    desc: "Team up with friends, claim rewards, and track your stats as you grow on the server.",
    points: [
      "/team gui to create squads and team chat",
      "Daily rewards and playtime bonuses",
      "Leaderboards and /stats to see how you rank",
    ],
  },
];

/** Server-rendered hero so LCP (h1) paints in the first HTML response. */
export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden p-6 font-sans text-white selection:bg-[#a855f74d]">
      <section className="relative z-10 flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-20">
        <HomeVisitorsOnline />

        <div className="animate-hero-title-in animate-delay-200 relative mb-2 text-center">
          <h1 className="select-none text-[18vw] font-black uppercase italic leading-none tracking-tighter md:text-[12rem]">
            ZEDX{" "}
            <span className="hero-smp-stack">
              <span className="hero-smp-text relative z-0 text-purple-500 drop-shadow-[0_0_30px_#a855f780]">
                SMP
              </span>
              <HomeHeroSticker />
            </span>
          </h1>
        </div>

        <p className="animate-hero-fade-up animate-delay-350 mb-12 ml-[1.2em] text-center text-[10px] font-medium uppercase tracking-[1.2em] text-purple-200">
          The ultimate multiplayer vanilla{" "}
          <span className="text-white">Experience</span>
        </p>

        <HomePageClient />
      </section>

      <section className="relative z-10 w-full max-w-5xl border-t border-white/5 py-32">
        <div className="animate-hero-fade-up animate-delay-1400 mb-12 text-center">
          <h2 className="mb-4 text-4xl font-black uppercase italic tracking-tighter md:text-5xl">
            Why Play <span className="text-purple-500">ZEDXSMP?</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm font-medium uppercase leading-relaxed tracking-wide text-white/60">
            A premium survival experience designed for players who value
            community, fair play, and a server that actually listens.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[11px] font-bold uppercase leading-relaxed tracking-wide text-white/55">
            Join at zedxsmp.fun — no modpack required. Java & Bedrock supported
            via Geyser.
          </p>
        </div>

        <HomePromoImage />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SMP_FEATURES.map((f, index) => (
            <div
              key={f.title}
              className={`group animate-hero-fade-up rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] p-8 transition-transform duration-300 hover:scale-[1.02] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.08)] ${FEATURE_ENTER_DELAYS[index]}`}
            >
              <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-purple-300 group-hover:text-purple-200">
                {f.title}
              </h3>
              <p className="mb-4 text-[11px] font-bold uppercase leading-relaxed tracking-wide text-white/60 group-hover:text-white/80">
                {f.desc}
              </p>
              <ul className="space-y-2 border-t border-white/[0.06] pt-4">
                {f.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-[10px] leading-relaxed text-white/45 group-hover:text-white/60"
                  >
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-500/80"
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter className="animate-hero-fade-up animate-delay-2100 mx-auto" />
    </main>
  );
}

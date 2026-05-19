/**
 * Single source of truth for monthly ranks (store cards + /ranks/about).
 */
export const monthlyRanks = [
  {
    id: "vip",
    slug: "vip",
    name: "VIP",
    tagline: "The Foundation",
    price: "£3.99",
    period: "/mo",
    tebexPackageId: "7443727",
    accent: "#FFE033",
    accentMuted: "rgba(255, 224, 51, 0.55)",
    glow: "rgba(255, 224, 51, 0.2)",
    color: "from-[#FFE033]/35 via-[#FFE033]/10 to-transparent",
    borderGlow:
      "conic-gradient(from 90deg, transparent 0%, #FFE033 18%, #B8860B 32%, transparent 52%)",
    nameClass: "text-[#FFE033] drop-shadow-[0_0_28px_rgba(255,224,51,0.45)]",
    popular: false,
    description:
      "Perfect starter rank — stand out with a yellow tag, faster progression, and essential QoL commands.",
    commands: ["/RTP", "/shop", "/pvp", "/tpa"],
    perks: [
      "Yellow name tag",
      "2 homes · 8 auctions",
      "£50k / month",
      "1.2× shard multiplier",
    ],
    kit: { name: "No kit included", cooldown: null, items: [] },
  },
  {
    id: "mvp",
    slug: "mvp",
    name: "MVP",
    tagline: "The Elite Standard",
    price: "£6.99",
    period: "/mo",
    tebexPackageId: "7443738",
    accent: "#FFAA00",
    accentMuted: "rgba(255, 170, 0, 0.55)",
    glow: "rgba(255, 170, 0, 0.22)",
    color: "from-[#FFAA00]/35 via-[#FF8800]/10 to-transparent",
    borderGlow:
      "conic-gradient(from 90deg, transparent 0%, #FFAA00 18%, #FF6600 32%, transparent 52%)",
    nameClass: "text-[#FFAA00] drop-shadow-[0_0_28px_rgba(255,170,0,0.45)]",
    popular: true,
    description:
      "Step up with golden prestige, auction power, and a monthly epic crate for serious players.",
    commands: ["/RTP", "/shop", "/pvp", "/tpa", "/ah"],
    perks: [
      "Golden name tag",
      "4 homes · 15 auctions",
      "£70k / month",
      "Epic crate monthly",
    ],
    kit: { name: "No kit included", cooldown: null, items: [] },
  },
  {
    id: "zedx",
    slug: "zedx",
    name: "ZEDX",
    tagline: "The Champion Tier",
    price: "£12.99",
    period: "/mo",
    tebexPackageId: "7443741",
    accent: "#00C3FF",
    accentMuted: "rgba(0, 195, 255, 0.55)",
    glow: "rgba(0, 195, 255, 0.22)",
    color: "from-[#00C3FF]/35 via-[#00C3FF]/10 to-transparent",
    borderGlow:
      "conic-gradient(from 90deg, transparent 0%, #00C3FF 18%, #0088FF 32%, transparent 52%)",
    nameClass: "text-[#00C3FF] drop-shadow-[0_0_28px_rgba(0,195,255,0.45)]",
    popular: false,
    description:
      "Champion perks, rare monthly crate, faster RTP, and a full diamond kit every week.",
    commands: ["/craft", "/heal", "/afk", "/shop"],
    perks: [
      "Light blue name tag",
      "6 homes · 25 auctions",
      "RTP cooldown 2 min",
      "Rare crate monthly",
    ],
    kit: {
      name: "ZEDX Kit",
      cooldown: "7 days",
      items: [
        "Full diamond (Prot III)",
        "32× golden apples",
        "Maxed diamond tools",
      ],
    },
  },
  {
    id: "zedx-plus",
    slug: "zedx-plus",
    name: "ZEDX+",
    tagline: "The Infinite Tier",
    price: "£19.99",
    period: "/mo",
    tebexPackageId: "7443744",
    accent: "#FF55FF",
    accentMuted: "rgba(255, 85, 255, 0.55)",
    secondaryAccent: "#00C3FF",
    glow: "rgba(255, 85, 255, 0.25)",
    isGradient: true,
    color: "from-cyan-400/25 via-pink-500/15 to-transparent",
    borderGlow:
      "conic-gradient(from 90deg, transparent 0%, #00C3FF 14%, #A855F7 28%, #FF55FF 42%, transparent 58%)",
    nameClass:
      "bg-gradient-to-br from-[#00C3FF] via-[#A855F7] to-[#FF55FF] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,85,255,0.35)]",
    popular: false,
    description:
      "Ultimate package — flight, ender chest, netherite kit, and the highest multipliers on the server.",
    commands: ["/fly", "/craft", "/heal", "/enderchest"],
    perks: [
      "ZEDX+ tag with + symbol",
      "5 homes · 40 auctions",
      "2× AFK multiplier",
      "/fly · /enderchest · weekly netherite kit",
    ],
    kit: {
      name: "ZEDX+ Kit",
      cooldown: "7 days",
      items: [
        "Full netherite set",
        "Full netherite tools",
        "64× golden apples",
      ],
    },
  },
];

/** Shape used by /ranks store cards */
export function getStoreRankCards() {
  return monthlyRanks.map((rank) => ({
    name: rank.name,
    slug: rank.slug,
    title: rank.tagline,
    price: rank.price,
    period: rank.period,
    accent: rank.accent,
    accentDim: rank.accentMuted,
    color: rank.color,
    borderGlow: rank.borderGlow,
    nameClass: rank.nameClass,
    features: rank.perks,
    popular: rank.popular,
    id: rank.tebexPackageId,
    link: `/ranks/about#${rank.slug}`,
  }));
}

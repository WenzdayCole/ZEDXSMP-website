import { TEBEX_RANK_PACKAGES } from "@/data/tebex-packages";

/**
 * Monthly ranks — synced with creator.tebex.io package names, prices, and descriptions.
 * tebexName must match the Tebex package title exactly (used at checkout).
 */
export const monthlyRanks = [
  {
    id: "vip",
    slug: "vip",
    name: "VIP RANK",
    tebexName: "VIP RANK",
    tagline: "The Foundation",
    price: "£2.99",
    period: "/mo",
    tebexPackageId: TEBEX_RANK_PACKAGES.vip,
    accent: "#FFE033",
    accentMuted: "rgba(255, 224, 51, 0.55)",
    glow: "rgba(255, 224, 51, 0.2)",
    color: "from-[#FFE033]/35 via-[#FFE033]/10 to-transparent",
    borderGlow:
      "conic-gradient(from 90deg, transparent 0%, #FFE033 18%, #B8860B 32%, transparent 52%)",
    nameClass: "text-[#FFE033] drop-shadow-[0_0_28px_rgba(255,224,51,0.45)]",
    popular: false,
    description:
      "Monthly VIP LuckPerms group for 30 days — yellow VIP tag, 3 homes, 20 orders, and 20 AH listings.",
    commands: [],
    perks: [
      "VIP chat & tab name tag (yellow VIP styling in-game)",
      "3 homes",
      "20 orders",
      "20 AH",
    ],
    storeFeatures: [
      "VIP name tag",
      "3 homes",
      "20 orders",
      "20 AH",
    ],
    kit: { items: [] },
  },
  {
    id: "mvp",
    slug: "mvp",
    name: "MVP RANK",
    tebexName: "MVP RANK",
    tagline: "The Elite Standard",
    price: "£4.99",
    period: "/mo",
    tebexPackageId: TEBEX_RANK_PACKAGES.mvp,
    accent: "#FFAA00",
    accentMuted: "rgba(255, 170, 0, 0.55)",
    glow: "rgba(255, 170, 0, 0.22)",
    color: "from-[#FFAA00]/35 via-[#FF8800]/10 to-transparent",
    borderGlow:
      "conic-gradient(from 90deg, transparent 0%, #FFAA00 18%, #FF6600 32%, transparent 52%)",
    nameClass: "text-[#FFAA00] drop-shadow-[0_0_28px_rgba(255,170,0,0.45)]",
    popular: true,
    description:
      "Monthly MVP LuckPerms group for 30 days — includes all VIP perks plus golden MVP tag, 5 homes, 30 orders, 30 AH, and 1.5× shard earnings.",
    commands: ["/trash", "/anvil"],
    perks: [
      "MVP chat & tab name tag (golden MVP styling in-game)",
      "5 homes",
      "30 orders",
      "30 AH",
      "1.5× shard multiplier on shard earnings",
      "/trash, /anvil",
    ],
    storeFeatures: [
      "MVP name tag · all VIP perks",
      "5 homes",
      "30 orders",
      "30 AH",
      "1.5× shard multiplier · /trash /anvil",
    ],
    kit: { items: [] },
  },
  {
    id: "zedx-plus",
    slug: "zedx-plus",
    name: "ZEDX+ RANK",
    tebexName: "ZEDX+ RANK",
    tagline: "The Infinite Tier",
    price: "£9.99",
    period: "/mo",
    tebexPackageId: TEBEX_RANK_PACKAGES.zedxPlus,
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
      "Top-tier ZEDX+ LuckPerms group for 30 days — all MVP and VIP perks, exclusive tag, 7 homes, 40 orders, 40 AH, 2× shards, and premium commands.",
    commands: ["/craft", "/enderchest", "/trash", "/anvil"],
    perks: [
      "ZEDX+ chat & tab name tag (exclusive cyan/pink gradient styling in-game)",
      "7 homes",
      "40 orders",
      "40 AH",
      "2× shard multiplier on shard earnings",
      "/craft, /enderchest, /trash, /anvil",
    ],
    storeFeatures: [
      "ZEDX+ name tag · all MVP & VIP perks",
      "7 homes",
      "40 orders",
      "40 AH",
      "2× shards · /craft /enderchest /trash /anvil",
    ],
    kit: { items: [] },
  },
];

/** Shape used by /ranks store cards */
export function getStoreRankCards() {
  return monthlyRanks.map((rank) => ({
    name: rank.name,
    checkoutName: rank.tebexName,
    slug: rank.slug,
    title: rank.tagline,
    price: rank.price,
    period: rank.period,
    accent: rank.accent,
    accentDim: rank.accentMuted,
    color: rank.color,
    borderGlow: rank.borderGlow,
    nameClass: rank.nameClass,
    features: rank.storeFeatures,
    popular: rank.popular,
    id: rank.tebexPackageId,
    link: `/ranks/about#${rank.id}`,
  }));
}

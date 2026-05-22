import { TEBEX_CRATE_PACKAGES } from "@/data/tebex-packages";

/** Crate keys for /ranks — names/prices match creator.tebex.io/packages */
export const crateKeys = [
  {
    name: "Common",
    tebexName: "Common Crate Key",
    price: "£1.19",
    color: "text-[#00FFFF]",
    border: "border-cyan-500/20",
    hover: "hover:border-cyan-500/50",
    glow: "shadow-cyan-500/10",
    tebexPackageId: TEBEX_CRATE_PACKAGES.common,
    img: "/keys/common.png",
    crateImg: "/keys/commoncrate.png",
    description:
      "The essential starter key. Great for grabbing basic resources, iron tools, and entry-level supplies.",
  },
  {
    name: "Epic",
    tebexName: "Epic Crate Key",
    price: "£3.59",
    color: "text-[#AA00AA]",
    border: "border-purple-500/20",
    hover: "hover:border-purple-500/50",
    glow: "shadow-purple-500/10",
    tebexPackageId: TEBEX_CRATE_PACKAGES.epic,
    img: "/keys/epic.png",
    crateImg: "/keys/epiccrate.png",
    description:
      "A major step up. Contains enchanted gear, rare blocks, and a high chance for valuable items.",
  },
  {
    name: "Rare",
    tebexName: "Rare Crate Key",
    price: "£4.79",
    color: "text-[#FFAA00]",
    border: "border-yellow-500/20",
    hover: "hover:border-yellow-500/50",
    glow: "shadow-yellow-500/10",
    tebexPackageId: TEBEX_CRATE_PACKAGES.rare,
    img: "/keys/rare.png",
    crateImg: "/keys/rarecrate.png",
    description:
      "Hard to find, easy to love. Offers mid-tier custom enchants and exclusive cosmetic particles.",
  },
  {
    name: "Legendary",
    tebexName: "Legendary Crate Key",
    price: "£5.99",
    color: "text-[#FF5555]",
    border: "border-red-500/20",
    hover: "hover:border-red-500/50",
    glow: "shadow-red-500/10",
    tebexPackageId: TEBEX_CRATE_PACKAGES.legendary,
    img: "/keys/legendary.png",
    crateImg: "/keys/legendarycrate.png",
    popular: true,
    description:
      "The gold standard of crates. Unlocks high-tier weaponry and server-wide boosters.",
  },
  {
    name: "Amethyst",
    tebexName: "Amethyst Crate Key",
    price: "£6.99",
    color: "text-[#55FF55]",
    border: "border-green-500/20",
    hover: "hover:border-green-500/50",
    glow: "shadow-green-500/10",
    tebexPackageId: TEBEX_CRATE_PACKAGES.amethyst,
    img: "/keys/amethyst.png",
    crateImg: "/keys/amethystcrate.png",
    description:
      "Pure power. Focuses on late-game progression, offering top-tier armor sets and rare spawners.",
  },
  {
    name: "ZEDX+",
    tebexName: "ZEDX+ Crate Key",
    price: "£12.99",
    color:
      "text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-pink-500",
    border: "border-pink-500/40",
    hover: "hover:border-pink-500/80",
    glow: "shadow-pink-500/20",
    tebexPackageId: TEBEX_CRATE_PACKAGES.zedxPlus,
    img: "/keys/zedx+.png",
    crateImg: "/keys/zedx+crate.png",
    description:
      "The ultimate crate experience. Includes a chance for the rarest ranks and unique items.",
  },
];

import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Rules",
  description:
    "ZEDX SMP server rules — no hacked clients, fair play, and a healthy economy.",
};

const RULE_SECTIONS = [
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
    description: "Respect the grind. Play the game as it was intended to be played.",
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
    description: "Keep the server healthy. Real-world trading is a permanent ban.",
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

export default function RulesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden p-4 font-sans text-white selection:bg-purple-500/30 md:p-12 lg:p-20">
      <div className="relative mx-auto max-w-7xl">
        <header className="mb-12 md:mb-20">
          <Link
            href="/"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.4em] text-purple-500 transition-all duration-300 hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-2">
              ←
            </span>{" "}
            Back to Home
          </Link>
          <h1 className="mb-4 text-6xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl">
            THE <span className="text-purple-500">RULES</span>
          </h1>
          <p className="max-w-2xl text-sm font-medium uppercase leading-relaxed tracking-wide text-white/50">
            Ignorance of these rules is not an excuse for breaking them.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-2">
          {RULE_SECTIONS.map((section, idx) => (
            <section
              key={section.title}
              className={`rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl md:rounded-[2.5rem] md:p-10 ${
                idx === 2 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="mb-8 border-b border-white/5 pb-6">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white md:text-4xl">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm text-white/45">{section.description}</p>
              </div>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {section.rules.map((rule) => (
                  <li
                    key={rule}
                    className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm font-bold uppercase tracking-tight text-white/70"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                    {rule}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <SiteFooter className="mx-auto mt-16" />
      </div>
    </main>
  );
}

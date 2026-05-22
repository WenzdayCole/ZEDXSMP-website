"use client";

import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import { useCheckoutPageRestore } from "@/hooks/useCheckoutPageRestore";
import { monthlyRanks as rankDetails } from "@/data/monthly-ranks";

function RankAccentBar({ rank }) {
  if (rank.isGradient) {
    return (
      <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#00C3FF] via-purple-500 to-[#FF55FF]" />
    );
  }
  return (
    <div
      className="h-1 w-full rounded-full"
      style={{ backgroundColor: rank.accent }}
    />
  );
}

function FeatureCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-white/15 hover:bg-white/[0.05]">
      <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-white/55">
        {title}
      </h4>
      {children}
    </div>
  );
}

function RankSection({ rank, index, checkout, isLoading }) {
  const hasKit = rank.kit.items.length > 0;
  const accentColor = rank.isGradient ? rank.secondaryAccent : rank.accent;

  return (
    <section id={rank.id} className="scroll-mt-28">
      <div
        className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0a0a12]/80 p-6 sm:p-8 md:p-10"
        style={{
          boxShadow: `0 0 80px -20px ${rank.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-[100px]"
          style={{ backgroundColor: rank.glow }}
        />

        <RankAccentBar rank={rank} />

        <div className="relative mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="lg:w-[min(100%,340px)] lg:shrink-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] font-bold text-white/25">
                0{index + 1}
              </span>
              {rank.popular && (
                <span className="rounded-full bg-purple-600 px-3 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-white">
                  Most popular
                </span>
              )}
              <span
                className="text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color: accentColor }}
              >
                {rank.tagline}
              </span>
            </div>

            <h2
              className={`mt-3 text-5xl font-black uppercase italic leading-none tracking-tighter sm:text-6xl md:text-7xl ${
                rank.isGradient
                  ? "bg-gradient-to-r from-[#00C3FF] to-[#FF55FF] bg-clip-text text-transparent"
                  : ""
              }`}
              style={!rank.isGradient ? { color: rank.accent } : undefined}
            >
              {rank.name}
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              {rank.description}
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-black text-white sm:text-5xl">
                  {rank.price}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                  / month
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  checkout(rank.tebexPackageId, rank.tebexName, {
                    price: rank.price,
                  })
                }
                disabled={isLoading(rank.tebexName)}
                className="mt-6 w-full min-h-[52px] rounded-xl bg-white py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-purple-500 hover:text-white active:scale-[0.98] disabled:opacity-50"
                style={{ boxShadow: `0 8px 32px -8px ${rank.glow}` }}
              >
                {isLoading(rank.tebexName)
                  ? "Opening checkout…"
                  : `Get ${rank.name}`}
              </button>

              <Link
                href="/ranks"
                className="mt-4 block text-center text-[10px] text-white/35 transition-colors hover:text-white/60"
              >
                ← Back to store overview
              </Link>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard title="Commands">
                <ul className="space-y-2">
                  {rank.commands.map((cmd) => (
                    <li
                      key={cmd}
                      className="flex items-center gap-2 font-mono text-xs text-white/70"
                    >
                      <span style={{ color: accentColor }} className="opacity-80">
                        ›
                      </span>
                      {cmd}
                    </li>
                  ))}
                </ul>
              </FeatureCard>

              <FeatureCard title="Perks">
                <ul className="space-y-2.5">
                  {rank.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-2 text-[12px] font-medium leading-snug text-white/65"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
              </FeatureCard>
            </div>

            {hasKit && (
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4
                      className={`text-xl font-black uppercase italic tracking-tight ${
                        rank.isGradient
                          ? "bg-gradient-to-r from-[#00C3FF] to-[#FF55FF] bg-clip-text text-transparent"
                          : ""
                      }`}
                      style={!rank.isGradient ? { color: rank.accent } : undefined}
                    >
                      {rank.kit.name}
                    </h4>
                    {rank.kit.cooldown && (
                      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-white/35">
                        Cooldown · {rank.kit.cooldown}
                      </p>
                    )}
                  </div>
                </div>

                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {rank.kit.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/30 px-3 py-2.5 text-[11px] font-semibold text-white/75"
                    >
                      <span style={{ color: accentColor }}>✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const { checkout, isLoading, resetCheckoutUi } = useCheckout();

  useCheckoutPageRestore(resetCheckoutUi);

  return (
    <main className="min-h-screen text-white selection:bg-purple-500/30">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[480px] w-[min(100%,900px)] -translate-x-1/2 bg-purple-600/12 blur-[120px]" />
      </div>

      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050208]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/ranks"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-white"
          >
            <span className="text-purple-400">←</span> Store
          </Link>
          <div className="flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {rankDetails.map((r) => (
              <a
                key={r.id}
                href={`#${r.id}`}
                className="shrink-0 rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/40 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span
                  style={!r.isGradient ? { color: r.accent } : undefined}
                  className={
                    r.isGradient
                      ? "bg-gradient-to-r from-[#00C3FF] to-[#FF55FF] bg-clip-text text-transparent"
                      : ""
                  }
                >
                  {r.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <header className="relative z-10 px-4 pb-12 pt-28 text-center sm:px-6 sm:pt-32">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter sm:text-7xl md:text-8xl">
          <span className="bg-gradient-to-b from-white via-white/90 to-purple-400 bg-clip-text text-transparent">
            Rank Details
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm text-white/45">
          Full breakdown of commands and perks. Purchase any rank — checkout
          takes under a minute on Tebex.
        </p>
        <Link
          href="/ranks"
          className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 text-[10px] font-black uppercase tracking-widest text-white/70 transition-colors hover:border-purple-500/40 hover:text-white"
        >
          View store cards
        </Link>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl space-y-10 px-4 pb-24 sm:px-6 sm:space-y-14">
        {rankDetails.map((rank, index) => (
          <RankSection
            key={rank.id}
            rank={rank}
            index={index}
            checkout={checkout}
            isLoading={isLoading}
          />
        ))}
      </div>

      <footer className="relative z-10 border-t border-white/5 py-16 text-center">
        <Link
          href="/ranks"
          className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 transition-colors hover:text-white"
        >
          ← Return to store
        </Link>
      </footer>
    </main>
  );
}

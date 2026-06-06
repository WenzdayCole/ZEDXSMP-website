"use client";

import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import { useCheckoutPageRestore } from "@/hooks/useCheckoutPageRestore";
import { monthlyRanks as rankDetails } from "@/data/monthly-ranks";
import SiteFooter from "@/app/components/SiteFooter";

const RANK_STATS = {
  vip: { homes: "3", ah: "20", orders: "20", shards: "1×" },
  mvp: { homes: "5", ah: "30", orders: "30", shards: "1.5×" },
  "zedx-plus": { homes: "7", ah: "40", orders: "40", shards: "2×" },
};

function PerkCheck({ accent }) {
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
      style={{
        borderColor: `${accent}44`,
        backgroundColor: `${accent}14`,
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden
      >
        <path
          d="M2.5 6.2 5 8.7 9.5 3.8"
          stroke={accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function RankCard({ rank, checkout, isLoading }) {
  const stats = RANK_STATS[rank.id];
  const hasCommands = rank.commands.length > 0;
  const displayPerks = hasCommands
    ? rank.perks.filter((perk) => !perk.trim().startsWith("/"))
    : rank.perks;

  return (
    <section id={rank.id} className="relative scroll-mt-28">
      {rank.popular && (
        <div
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#050208] px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-black shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${rank.accent}, #ff6600)`,
            boxShadow: `0 4px 20px ${rank.accent}66`,
          }}
        >
          Popular
        </div>
      )}
      <article
        className="group relative overflow-hidden rounded-[2rem] border bg-[#050208] p-6 md:p-8"
        style={{ borderColor: `${rank.accent}28` }}
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${rank.color} opacity-[0.12] transition-opacity duration-500 group-hover:opacity-[0.18]`}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${rank.accent}, transparent)`,
          }}
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="text-[10px] font-black uppercase tracking-[0.35em]"
                style={{ color: rank.accentMuted }}
              >
                {rank.tagline}
              </span>
            </div>
            <h2
              className={`text-4xl font-black uppercase italic leading-none tracking-tighter md:text-5xl ${rank.nameClass}`}
            >
              {rank.name}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
              {rank.description}
            </p>

            <div
              className="mt-6 inline-flex flex-wrap items-center gap-x-1 rounded-2xl border px-1 py-1"
              style={{
                borderColor: `${rank.accent}22`,
                backgroundColor: `${rank.accent}06`,
              }}
            >
              {[
                ["Homes", stats.homes],
                ["AH", stats.ah],
                ["Orders", stats.orders],
                ["Shards", stats.shards],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex items-baseline gap-2 px-3 py-2 ${i > 0 ? "border-l border-white/[0.06]" : ""}`}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/35">
                    {label}
                  </span>
                  <span
                    className="font-mono text-sm font-bold text-white"
                    style={{ color: i === 3 ? rank.accent : undefined }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative shrink-0 rounded-2xl border p-5 lg:w-[220px]"
            style={{
              borderColor: `${rank.accent}30`,
              background: `linear-gradient(160deg, ${rank.accent}12 0%, rgba(5,2,8,0.9) 100%)`,
            }}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/35">
              Monthly
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-black text-white">
                {rank.price}
              </span>
              <span className="text-[10px] font-bold uppercase text-white/35">
                /mo
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
              style={{ "--rank-accent": rank.accent }}
              className="mt-4 w-full min-h-[46px] rounded-xl bg-white py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-[var(--rank-accent)] hover:text-white active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading(rank.tebexName) ? "Processing…" : "Purchase rank"}
            </button>
          </div>
        </div>

        <div className="relative mt-8 border-t border-white/[0.06] pt-7">
          <div className="mb-5 flex items-center gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-white/45">
              What you get
            </h3>
            <span
              className="h-px flex-1 max-w-[120px]"
              style={{
                background: `linear-gradient(90deg, ${rank.accent}88, transparent)`,
              }}
            />
          </div>

          <ul className="columns-1 gap-x-8 sm:columns-2">
            {displayPerks.map((perk) => (
              <li
                key={perk}
                className="mb-3 break-inside-avoid flex items-start gap-3 rounded-xl px-1 py-1.5 transition-colors hover:bg-white/[0.02]"
              >
                <PerkCheck accent={rank.accent} />
                <span className="text-[15px] leading-relaxed text-white/88">
                  {perk}
                </span>
              </li>
            ))}
          </ul>

          {hasCommands && (
            <div
              className="mt-5 flex flex-col gap-2.5 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
              style={{
                borderColor: `${rank.accent}18`,
                backgroundColor: `${rank.accent}06`,
              }}
            >
              <span
                className="shrink-0 text-[9px] font-black uppercase tracking-[0.28em]"
                style={{ color: rank.accentMuted }}
              >
                Commands
              </span>
              <div className="flex flex-wrap gap-1.5">
                {rank.commands.map((cmd) => (
                  <code
                    key={cmd}
                    className="rounded-md border px-2 py-0.5 font-mono text-[10px] text-white/75"
                    style={{
                      borderColor: `${rank.accent}28`,
                      backgroundColor: `${rank.accent}0c`,
                    }}
                  >
                    {cmd}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export default function AboutPage() {
  const { checkout, isLoading, resetCheckoutUi } = useCheckout();

  useCheckoutPageRestore(resetCheckoutUi);

  return (
    <main className="relative z-10 min-h-screen overflow-x-hidden p-6 font-sans text-white selection:bg-purple-500/30 md:p-12">
      <div className="relative mx-auto max-w-4xl">
        <header className="mb-14 md:mb-16">
          <Link
            href="/ranks"
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 transition-colors hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>{" "}
            Back to store
          </Link>
          <h1 className="mt-6 text-5xl font-black uppercase italic leading-none tracking-tighter md:text-7xl">
            Rank <span className="text-purple-500">Details</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55">
            Perks, limits, and pricing for each monthly rank. Purchase through
            Tebex at checkout.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {rankDetails.map((rank) => (
              <a
                key={rank.id}
                href={`#${rank.id}`}
                className="rounded-full border px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:brightness-110"
                style={{
                  borderColor: `${rank.accent}55`,
                  backgroundColor: `${rank.accent}14`,
                  color: rank.accent,
                  boxShadow: `0 0 20px ${rank.accent}18`,
                }}
              >
                {rank.name.replace(" RANK", "")}
              </a>
            ))}
          </div>
        </header>

        <div className="space-y-10 pb-20 md:space-y-12">
          {rankDetails.map((rank) => (
            <RankCard
              key={rank.id}
              rank={rank}
              checkout={checkout}
              isLoading={isLoading}
            />
          ))}
        </div>

        <SiteFooter className="mx-auto" />
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import { useCheckoutPageRestore } from "@/hooks/useCheckoutPageRestore";
import { monthlyRanks as rankDetails } from "@/data/monthly-ranks";
import SiteFooter from "@/app/components/SiteFooter";
import PolicyModal from "@/app/components/PolicyModal";

const RANK_STATS = {
  vip: { homes: "3", ah: "20", orders: "20", shards: "1×" },
  mvp: { homes: "5", ah: "30", orders: "30", shards: "1.5×" },
  "zedx-plus": { homes: "7", ah: "40", orders: "40", shards: "2×" },
};

function RankCard({ rank, checkout, isLoading }) {
  const stats = RANK_STATS[rank.id];

  return (
    <section id={rank.id} className="relative scroll-mt-28">
      <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8 lg:p-10">
        <div
          className="mb-8 h-0.5 w-16 rounded-full"
          style={{ backgroundColor: rank.accent }}
        />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/45">
                {rank.tagline}
              </span>
              {rank.popular && (
                <span className="rounded-full bg-purple-600/80 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                  Popular
                </span>
              )}
            </div>
            <h2
              className={`text-4xl font-black uppercase italic leading-none tracking-tighter md:text-5xl lg:text-6xl ${rank.nameClass}`}
            >
              {rank.name}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
              {rank.description}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-black/30 p-5 lg:min-w-[220px]">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl font-black text-white">
                {rank.price}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
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
              className="mt-5 w-full min-h-[48px] rounded-xl bg-white py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-purple-500 hover:text-white active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading(rank.tebexName) ? "Processing…" : "Purchase rank"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Homes", stats.homes],
            ["AH", stats.ah],
            ["Orders", stats.orders],
            ["Shards", stats.shards],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.08] bg-black/20 px-3 py-4 text-center"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
                {label}
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-white">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 grid gap-6 ${rank.id === "mvp" || rank.id === "zedx-plus" ? "lg:grid-cols-2" : ""}`}
        >
          <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
            <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-white/50">
              Perks included
            </h3>
            <ul className="space-y-2.5">
              {rank.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-2.5 text-sm leading-snug text-white/70"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {(rank.id === "mvp" || rank.id === "zedx-plus") && (
            <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
              <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-white/50">
                Commands unlocked
              </h3>
              <div className="flex flex-wrap gap-2">
                {rank.commands.map((cmd) => (
                  <code
                    key={cmd}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-white/80"
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

function QuickCompareTable() {
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/45">
              Tier
            </th>
            <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-white/45">
              Price
            </th>
            <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-white/45">
              Homes
            </th>
            <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-white/45">
              AH
            </th>
            <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-white/45">
              Orders
            </th>
            <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-white/45">
              Shards
            </th>
          </tr>
        </thead>
        <tbody>
          {rankDetails.map((rank) => {
            const stats = RANK_STATS[rank.id];
            return (
              <tr
                key={rank.id}
                className="border-b border-white/[0.06] last:border-0"
              >
                <td className="px-4 py-4">
                  <span
                    className={`text-sm font-black uppercase italic ${rank.nameClass}`}
                  >
                    {rank.name.replace(" RANK", "")}
                  </span>
                </td>
                <td className="px-3 py-4 font-mono font-bold text-white">
                  {rank.price}
                </td>
                <td className="px-3 py-4 font-mono text-white/75">
                  {stats.homes}
                </td>
                <td className="px-3 py-4 font-mono text-white/75">
                  {stats.ah}
                </td>
                <td className="px-3 py-4 font-mono text-white/75">
                  {stats.orders}
                </td>
                <td className="px-3 py-4 font-mono text-white/75">
                  {stats.shards}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function AboutPage() {
  const { checkout, isLoading, resetCheckoutUi } = useCheckout();
  const [compareOpen, setCompareOpen] = useState(false);

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
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              Quick compare
            </button>
            {rankDetails.map((rank) => (
              <a
                key={rank.id}
                href={`#${rank.id}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-white/50 transition-colors hover:border-white/20 hover:text-white/80"
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

      {compareOpen && (
        <PolicyModal
          title="Quick Compare"
          subtitle="All ranks at a glance"
          wide
          onClose={() => setCompareOpen(false)}
        >
          <QuickCompareTable />
        </PolicyModal>
      )}
    </main>
  );
}

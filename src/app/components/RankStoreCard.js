"use client";

import Link from "next/link";
import { getRankSaleDiscountPercent } from "@/lib/rank-sale-price";
import { useCheckout } from "@/context/CheckoutContext";

export default function RankStoreCard({ rank, featured = false }) {
  const { checkout, isLoading, addItem } = useCheckout();
  const saleDiscount = getRankSaleDiscountPercent(rank.wasPrice, rank.price);

  return (
    <div
      className={`group relative flex h-full flex-col transition-transform duration-500 hover:-translate-y-2 ${
        featured ? "scale-[1.03] xl:scale-[1.06]" : ""
      }`}
    >
      {rank.popular && (
        <div
          className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-black shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${rank.accent}, #FF6600)`,
            boxShadow: `0 4px 20px ${rank.accent}66`,
          }}
        >
          Most Popular
        </div>
      )}
      <div
        className="absolute -inset-[1.5px] overflow-hidden rounded-[2.6rem] max-lg:hidden"
        aria-hidden
      >
        <div
          className="absolute inset-[-250%] animate-border-glow"
          style={{ background: rank.borderGlow }}
        />
      </div>
      <div
        className={`relative z-10 flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border bg-[#050208] ${
          featured ? "p-7 xl:p-8" : "p-6 xl:p-7"
        }`}
        style={{ borderColor: `${rank.accent}33` }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
          style={{
            background: `linear-gradient(90deg, transparent, ${rank.accent}, transparent)`,
          }}
        />
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${rank.color} opacity-[0.14] transition-opacity duration-500 group-hover:opacity-100`}
        />
        <div className="relative mb-8">
          <span
            className="mb-2 block text-[9px] font-black uppercase tracking-[0.3em]"
            style={{ color: rank.accentDim }}
          >
            {rank.title}
          </span>
          <h2
            className={`mb-4 font-black uppercase italic tracking-tighter ${
              featured ? "text-4xl" : "text-3xl xl:text-[1.85rem]"
            } ${rank.nameClass}`}
          >
            {rank.name}
          </h2>
          <div className="mb-2">
            {saleDiscount != null && (
              <span className="inline-block rounded-full border border-red-400/25 bg-red-500/15 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-[0.22em] text-red-200">
                {saleDiscount}% Off
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-mono text-xl font-bold tracking-tight text-white/30 line-through decoration-white/25">
              {rank.wasPrice}
            </span>
            <span
              className={`font-mono font-black tracking-tighter text-white ${
                featured ? "text-5xl" : "text-4xl xl:text-[2.5rem]"
              }`}
            >
              {rank.price}
            </span>
            <span
              className="text-[10px] font-bold uppercase"
              style={{ color: rank.accentDim }}
            >
              {rank.period}
            </span>
          </div>
        </div>
        <ul className="relative mb-10 flex-1 space-y-3">
          {rank.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-3 text-[11px] font-bold text-white/75 transition-colors group-hover:text-white"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: rank.accent,
                  boxShadow: `0 0 8px ${rank.accent}`,
                }}
              />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            checkout(rank.id, rank.checkoutName, {
              price: rank.price + rank.period,
              type: "rank",
            })
          }
          style={{ "--rank-accent": rank.accent }}
          className="relative z-20 w-full rounded-2xl bg-white py-5 text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-[var(--rank-accent)] hover:text-white"
        >
          {isLoading(rank.checkoutName) ? "Processing..." : "Purchase Rank"}
        </button>
        <button
          type="button"
          onClick={() => addItem(rank.id)}
          className="relative z-20 mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] py-3.5 text-[10px] font-black uppercase tracking-[0.25em] text-white/75 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          Add monthly to basket
        </button>
        <Link
          href={rank.link}
          className="relative z-20 mt-3 block text-center text-[10px] text-white/70 transition-colors hover:text-white"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = rank.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "";
          }}
        >
          view more details
        </Link>
      </div>
    </div>
  );
}

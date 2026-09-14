import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import { LEGAL_SHOP_HOST, LEGAL_UPDATED } from "@/data/legal";

export default function LegalPage({ title, accent, description, children }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden p-4 font-sans text-white selection:bg-purple-500/30 md:p-12 lg:p-20">
      <div className="relative mx-auto max-w-3xl">
        <header className="mb-12 md:mb-16">
          <Link
            href="/"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.4em] text-purple-500 transition-all duration-300 hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-2">
              ←
            </span>{" "}
            Back to Home
          </Link>
          <h1 className="mb-4 text-5xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-7xl">
            {title} <span className="text-purple-500">{accent}</span>
          </h1>
          <p className="max-w-2xl text-sm font-medium uppercase leading-relaxed tracking-wide text-white/50">
            {description}
          </p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
            Last updated {LEGAL_UPDATED} · {LEGAL_SHOP_HOST}
          </p>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl md:rounded-[2.5rem] md:p-10">
          {children}
        </div>

        <SiteFooter className="mx-auto mt-16" />
      </div>
    </main>
  );
}

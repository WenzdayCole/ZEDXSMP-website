import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import StoreToolbar from "@/app/components/StoreToolbar";
import RankGrid from "@/app/components/RankGrid";
import CrateKeysSection from "@/app/components/CrateKeysSection";

export default function RanksPage() {
  return (
    <main className="relative z-10 min-h-screen overflow-x-hidden p-6 pb-40 font-sans text-white selection:bg-purple-500/30 md:p-12">
      <div className="relative mx-auto max-w-[100rem]">
        <header className="mb-20 text-center md:text-left">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 transition-all hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>{" "}
            Back to Home
          </Link>
          <div className="mt-4 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-6xl font-black uppercase italic leading-none tracking-tighter md:text-7xl">
              Server <span className="text-purple-400">Store</span>
            </h1>
            <StoreToolbar />
          </div>
        </header>

        <RankGrid />
        <CrateKeysSection />
      </div>

      <SiteFooter className="mx-auto mt-20" />
    </main>
  );
}

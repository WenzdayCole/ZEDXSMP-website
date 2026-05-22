import HomePageClient from "@/app/components/HomePageClient";
import HomeFooterClient from "@/app/components/HomeFooterClient";

const SMP_FEATURES = [
  { title: "Vanilla+", desc: "Pure survival with essential QoL tweaks." },
  { title: "No Grief", desc: "Advanced land claims to protect builds." },
  { title: "Economy", desc: "Player-driven shops and global trade." },
  { title: "Community", desc: "Active Discord and weekly events." },
];

/** Server-rendered hero so LCP (h1) paints in the first HTML response. */
export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden p-6 font-sans text-white selection:bg-[#a855f74d]">
      <section className="relative z-10 flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-20">
        <div className="relative mb-2 text-center">
          <h1 className="select-none text-[18vw] font-black uppercase italic leading-none tracking-tighter md:text-[12rem]">
            ZEDX{" "}
            <span className="text-purple-500 drop-shadow-[0_0_30px_#a855f780]">
              SMP
            </span>
          </h1>
        </div>

        <p className="mb-12 ml-[1.2em] text-center text-[10px] font-medium uppercase tracking-[1.2em] text-purple-200">
          The ultimate multiplayer vanilla{" "}
          <span className="text-white">Experience</span>
        </p>

        <HomePageClient />
      </section>

      <section className="relative z-10 w-full max-w-4xl border-t border-white/5 py-32">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-4xl font-black uppercase italic tracking-tighter md:text-5xl">
            Why Play <span className="text-purple-500">ZEDXSMP?</span>
          </h2>
          <p className="mx-auto max-w-lg text-sm font-medium uppercase leading-relaxed tracking-wide text-white/60">
            A premium survival experience designed for players who value
            community and fair play.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SMP_FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] p-8 transition-transform duration-300 hover:scale-[1.02] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.08)]"
            >
              <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-purple-300 group-hover:text-purple-200">
                {f.title}
              </h3>
              <p className="text-[11px] font-bold uppercase leading-relaxed tracking-wide text-white/60 group-hover:text-white/80">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <HomeFooterClient />
    </main>
  );
}

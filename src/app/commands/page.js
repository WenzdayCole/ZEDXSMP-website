import Link from "next/link";
import { commandCategories } from "@/data/commands";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata = {
  title: "Commands",
  description:
    "Full list of ZEDX SMP in-game commands — chat, teleport, economy, teams, and more.",
};

export default function CommandsPage() {
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
            SERVER{" "}
            <span className="text-purple-500">COMMANDS</span>
          </h1>
          <p className="max-w-2xl text-sm font-medium uppercase leading-relaxed tracking-wide text-white/50">
            Every command you need on ZEDX SMP. Type them in chat with a{" "}
            <span className="font-mono text-purple-300">/</span> prefix.
          </p>
          <p className="mt-4 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-[11px] font-medium leading-relaxed text-white/55">
            <span className="font-black uppercase tracking-widest text-purple-300">
              Voice chat
            </span>{" "}
            is enabled on the server — use proximity voice in-game to talk with
            nearby players.
          </p>
        </header>

        <div className="flex flex-col gap-8 md:gap-10">
          {commandCategories.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-3xl md:rounded-[2.5rem] md:p-10"
            >
              <div className="mb-8 border-b border-white/5 pb-6">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white md:text-4xl">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm text-white/45">{section.description}</p>
              </div>

              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {section.commands.map((cmd) => (
                  <li
                    key={cmd.name}
                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 transition-colors hover:border-purple-500/30 hover:bg-white/[0.06]"
                  >
                    <code className="font-mono text-sm font-bold text-purple-300">
                      /{cmd.name}
                    </code>
                    <p className="mt-1 font-mono text-[10px] text-white/35">
                      {cmd.usage}
                    </p>
                    <p className="mt-2 text-[11px] font-medium leading-relaxed text-white/60 group-hover:text-white/75">
                      {cmd.desc}
                    </p>
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

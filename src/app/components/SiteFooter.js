"use client";

import Link from "next/link";
import { LEGAL_DISCORD_URL } from "@/data/legal";

const FOOTER_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/refund", label: "Refunds" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
  { href: "/login", label: "Login" },
];

export default function SiteFooter({ className = "" }) {
  return (
    <footer
      className={`relative z-10 flex w-full max-w-6xl flex-col items-center gap-3 border-t border-white/5 py-10 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {FOOTER_LINKS.map((link, i) => (
          <span key={link.href} className="flex items-center gap-x-3">
            {i > 0 && (
              <span className="text-[7px] text-white/15" aria-hidden>
                ·
              </span>
            )}
            <Link
              href={link.href}
              className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white/70"
            >
              {link.label}
            </Link>
          </span>
        ))}
        <span className="text-[7px] text-white/15" aria-hidden>
          ·
        </span>
        <a
          href={LEGAL_DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white/70"
        >
          Discord
        </a>
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/65">
        © 2026 ZEDXSMP · The official website
      </p>
    </footer>
  );
}

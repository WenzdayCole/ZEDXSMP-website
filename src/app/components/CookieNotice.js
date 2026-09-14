"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "zedx_cookie_notice_dismissed";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    setVisible(true);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-white/10 bg-[#0a0a0f]/95 p-4 shadow-[0_16px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:flex-row sm:items-center">
        <p className="flex-1 text-[11px] leading-relaxed text-white/60">
          We use a login session cookie and Stripe uses cookies on their
          checkout page. No advertising trackers.{" "}
          <Link
            href="/cookies"
            className="font-bold text-purple-300 hover:text-white"
          >
            Cookie notice
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-black hover:bg-purple-500 hover:text-white"
        >
          OK
        </button>
      </div>
    </div>
  );
}

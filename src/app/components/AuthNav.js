"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const btnClass =
  "inline-flex h-12 min-w-[7.5rem] items-center justify-center rounded-full border px-6 text-sm font-black uppercase tracking-[0.18em] transition-colors sm:h-14 sm:min-w-[8.5rem] sm:px-7 sm:text-base";

export default function AuthNav({ className = "" }) {
  const [me, setMe] = useState({ loggedIn: false });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then(setMe)
      .catch(() => setMe({ loggedIn: false }));
  }, []);

  if (me.loggedIn) {
    return (
      <Link
        href="/account"
        className={`${btnClass} max-w-[12rem] truncate border-purple-400/35 bg-purple-500/15 text-white hover:border-purple-300/50 hover:bg-purple-500/25 ${className}`.trim()}
      >
        {me.player}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className={`${btnClass} border-white/25 bg-white text-black hover:bg-purple-500 hover:text-white ${className}`.trim()}
    >
      Login
    </Link>
  );
}

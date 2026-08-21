"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AuthNav({ className = "" }) {
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then(setMe)
      .catch(() => setMe({ loggedIn: false }));
  }, []);

  if (!me) return null;

  if (me.loggedIn) {
    return (
      <Link
        href="/account"
        className={`text-[10px] font-black uppercase tracking-[0.28em] text-purple-300 transition-colors hover:text-white ${className}`.trim()}
      >
        {me.player}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className={`text-[10px] font-black uppercase tracking-[0.28em] text-white/50 transition-colors hover:text-white ${className}`.trim()}
    >
      Login
    </Link>
  );
}

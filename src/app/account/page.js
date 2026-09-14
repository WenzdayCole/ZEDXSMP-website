"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteFooter from "@/app/components/SiteFooter";

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [canManage, setCanManage] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn) {
          router.replace("/login");
          return;
        }
        setMe(data);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  useEffect(() => {
    if (!me) return;
    fetch("/api/account/portal")
      .then((res) => res.json())
      .then((data) => setCanManage(Boolean(data.canManage)))
      .catch(() => setCanManage(false));
  }, [me]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function openPortal() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/account/portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not open billing.");
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (!me) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/40">
        Loading…
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto min-h-screen max-w-lg px-6 py-16 text-white">
      <Link
        href="/ranks"
        className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 hover:text-white"
      >
        ← Store
      </Link>
      <h1 className="mt-6 text-4xl font-black uppercase italic tracking-tighter">
        Your <span className="text-purple-500">account</span>
      </h1>
      <p className="mt-2 font-mono text-lg text-white/70">{me.player}</p>
      {me.email && <p className="mt-1 text-sm text-white/40">{me.email}</p>}

      <div className="mt-8 space-y-3">
        {canManage && (
          <button
            type="button"
            onClick={openPortal}
            disabled={busy}
            className="w-full min-h-[52px] rounded-2xl bg-white text-[11px] font-black uppercase tracking-[0.2em] text-black hover:bg-purple-500 hover:text-white disabled:opacity-50"
          >
            {busy ? "Opening…" : "Manage / cancel subscription"}
          </button>
        )}
        <button
          type="button"
          onClick={logout}
          className="w-full min-h-[44px] rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white"
        >
          Log out
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
          {error}
        </p>
      )}

      <p className="mt-8 text-xs leading-relaxed text-white/40">
        Change your website password in-game with{" "}
        <span className="font-mono text-white/70">/changepass</span>. Receipts
        go to whoever paid. A monthly gift can only be cancelled by the buyer
        after they log in with their own username. One-month ranks expire
        in-game and have nothing to cancel.
      </p>
      <SiteFooter className="mt-16" />
    </main>
  );
}

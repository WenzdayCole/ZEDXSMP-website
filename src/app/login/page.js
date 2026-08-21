"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  isValidMinecraftUsernameFormat,
  sanitizeMinecraftUsername,
} from "@/lib/minecraft-username";
import SiteFooter from "@/app/components/SiteFooter";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [platform, setPlatform] = useState("java");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function buildPlayer() {
    let name = sanitizeMinecraftUsername(username);
    if (platform === "bedrock" && name && !name.startsWith(".")) name = `.${name}`;
    if (platform === "java" && name.startsWith(".")) name = name.slice(1);
    return name;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const player = buildPlayer();
    if (!isValidMinecraftUsernameFormat(player)) {
      setError("Use your exact in-game name. Java = Steve. Bedrock = .Steve");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const path = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player,
          password,
          email: mode === "register" ? email : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
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
        Website <span className="text-purple-500">login</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-white/50">
        Set your password in-game first:{" "}
        <span className="font-mono text-white/80">/register &lt;password&gt; &lt;password&gt;</span>
        . Then sign in here with that exact username. Java is{" "}
        <span className="font-mono text-white/80">Steve</span>. Bedrock is{" "}
        <span className="font-mono text-white/80">.Steve</span>.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-2">
        {[
          { id: "login", label: "Sign in" },
          { id: "register", label: "Link account" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setMode(tab.id);
              setError("");
            }}
            className={`rounded-2xl border py-3 text-[10px] font-black uppercase tracking-widest ${
              mode === tab.id
                ? "border-purple-500 bg-purple-500/20 text-white"
                : "border-white/10 bg-white/5 text-white/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-6"
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "java", label: "Java", hint: "Steve" },
            { id: "bedrock", label: "Bedrock", hint: ".Steve" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPlatform(opt.id)}
              className={`rounded-2xl border px-3 py-3 text-left ${
                platform === opt.id
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-white/10 bg-black/20 text-white/40"
              }`}
            >
              <span className="block text-[10px] font-black uppercase tracking-widest">
                {opt.label}
              </span>
              <span className="font-mono text-[10px] text-white/40">{opt.hint}</span>
            </button>
          ))}
        </div>

        <label className="mt-5 mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          In-game username
        </label>
        <div className="relative">
          {platform === "bedrock" && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg font-bold text-cyan-400">
              .
            </span>
          )}
          <input
            type="text"
            autoComplete="username"
            spellCheck={false}
            maxLength={16}
            value={username}
            onChange={(e) =>
              setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
            }
            className={`w-full min-h-[52px] rounded-2xl border border-white/10 bg-black/30 py-3 font-mono text-lg font-bold outline-none focus:border-purple-500 ${
              platform === "bedrock" ? "pl-8 pr-4" : "px-4"
            }`}
            placeholder={platform === "bedrock" ? "Steve" : "YourName"}
          />
        </div>

        {mode === "register" && (
          <>
            <label className="mt-5 mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[52px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-purple-500"
              placeholder="you@email.com"
            />
          </>
        )}

        <label className="mt-5 mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          Website password
        </label>
        <input
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full min-h-[52px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-purple-500"
          placeholder="Same as /register in-game"
        />

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full min-h-[52px] rounded-2xl bg-white text-[11px] font-black uppercase tracking-[0.2em] text-black hover:bg-purple-500 hover:text-white disabled:opacity-50"
        >
          {busy ? "Checking…" : mode === "login" ? "Sign in" : "Link account"}
        </button>
      </form>
      <SiteFooter className="mt-16" />
    </main>
  );
}

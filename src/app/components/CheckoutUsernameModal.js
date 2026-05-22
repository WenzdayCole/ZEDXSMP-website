"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  isValidMinecraftUsernameFormat,
  sanitizeMinecraftUsername,
} from "@/lib/minecraft-username";
import {
  lockCheckoutPage,
  releaseCheckoutPageLock,
} from "@/lib/checkout-page-lock";

export default function CheckoutUsernameModal({
  open,
  itemName,
  itemPrice,
  processing,
  error,
  onClose,
  onConfirm,
}) {
  const [platform, setPlatform] = useState("java");
  const [username, setUsername] = useState("");
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUsername("");
      setLocalError("");
      setPlatform("java");
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      releaseCheckoutPageLock();
      return;
    }
    lockCheckoutPage();
    return () => releaseCheckoutPageLock();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, processing, onClose]);

  function scrollInputIntoView() {
    requestAnimationFrame(() => {
      inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  function buildFinalUsername() {
    let name = sanitizeMinecraftUsername(username);
    if (platform === "bedrock" && name && !name.startsWith(".")) {
      name = `.${name}`;
    }
    if (platform === "java" && name.startsWith(".")) {
      name = name.slice(1);
    }
    return name;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const finalName = buildFinalUsername();

    if (!finalName) {
      setLocalError("Enter your in-game username.");
      return;
    }

    if (!isValidMinecraftUsernameFormat(finalName)) {
      setLocalError("Use 3–16 characters: letters, numbers, and underscore only.");
      return;
    }

    setLocalError("");
    onConfirm(finalName);
  }

  const displayError = localError || error;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          data-checkout-overlay
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
          role="presentation"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            aria-label="Close checkout"
            className="absolute inset-0 bg-[#030108]/65 backdrop-blur-xl backdrop-saturate-150"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-modal-title"
            className="relative z-10 flex w-full max-h-[min(90dvh,100%)] max-w-md flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0a0f] shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_80px_rgba(147,51,234,0.2)] ring-1 ring-white/[0.06] sm:rounded-[2rem]"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8 md:px-10"
            >
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl text-white/30 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40 sm:right-5 sm:top-5"
                aria-label="Close"
              >
                ✕
              </button>

              <p className="pr-10 text-[10px] font-black uppercase tracking-[0.35em] text-purple-400 sm:tracking-[0.4em]">
                Secure checkout
              </p>
              <h2
                id="checkout-modal-title"
                className="mt-1.5 pr-8 text-xl font-black uppercase italic tracking-tight text-white sm:mt-2 sm:text-2xl"
              >
                {itemName || "Purchase"}
              </h2>
              {itemPrice && (
                <p className="mt-0.5 font-mono text-base font-bold text-white/50 sm:text-lg">
                  {itemPrice}
                </p>
              )}

              <p className="mt-4 text-[13px] leading-relaxed text-white/50 sm:mt-6 sm:text-sm">
                Enter the username you use on{" "}
                <span className="font-bold text-purple-300">zedxsmp.fun</span>.
                Items are delivered to this account in-game.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6">
                {[
                  { id: "java", label: "Java Edition", hint: "PC" },
                  { id: "bedrock", label: "Bedrock", hint: "Phone / Xbox" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={processing}
                    onClick={() => setPlatform(opt.id)}
                    className={`min-h-[52px] rounded-2xl border px-3 py-3 text-left transition-colors active:scale-[0.98] ${
                      platform === opt.id
                        ? "border-purple-500 bg-purple-500/20 text-white"
                        : "border-white/10 bg-white/5 text-white/40"
                    }`}
                  >
                    <span className="block text-[10px] font-black uppercase tracking-widest">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-white/40">{opt.hint}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-4 sm:mt-5">
                <label
                  htmlFor="mc-username"
                  className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/40"
                >
                  In-game username
                </label>
                <div className="relative">
                  {platform === "bedrock" && (
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg font-bold text-cyan-400">
                      .
                    </span>
                  )}
                  <input
                    ref={inputRef}
                    id="mc-username"
                    type="text"
                    inputMode="text"
                    enterKeyHint="go"
                    autoComplete="username"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    maxLength={16}
                    disabled={processing}
                    value={username}
                    onFocus={scrollInputIntoView}
                    onChange={(e) => {
                      setUsername(
                        e.target.value.replace(/[^a-zA-Z0-9_]/g, ""),
                      );
                      setLocalError("");
                    }}
                    placeholder={platform === "bedrock" ? "Steve" : "YourName"}
                    className={`w-full min-h-[52px] rounded-2xl border border-white/10 bg-white/5 py-3 font-mono text-lg font-bold text-white outline-none transition-colors placeholder:text-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 disabled:opacity-50 ${
                      platform === "bedrock" ? "pl-8 pr-4" : "px-4"
                    }`}
                  />
                </div>
                <p className="mt-2 text-[10px] leading-snug text-white/30">
                  {platform === "bedrock"
                    ? "Bedrock players: we add the dot prefix automatically."
                    : "Use your exact Java username (no dot)."}
                </p>

                {displayError && (
                  <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium leading-relaxed text-red-300 whitespace-pre-line">
                    {displayError}
                  </p>
                )}

                {processing && (
                  <p className="mt-4 text-center text-[10px] leading-relaxed text-white/40">
                    You&apos;ll complete payment on Tebex&apos;s secure page.
                    We&apos;ll bring you back here when done.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={processing}
                  className="mt-5 w-full min-h-[52px] rounded-2xl bg-white py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-colors active:scale-[0.99] hover:bg-purple-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6 sm:tracking-[0.25em]"
                >
                  {processing
                    ? "Redirecting to Tebex…"
                    : "Continue to payment"}
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={onClose}
                  className="mt-4 flex min-h-[44px] w-full items-center justify-center py-2 text-[10px] font-bold uppercase tracking-widest text-white/35 transition-colors active:text-white hover:text-white/60"
                >
                  Cancel
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

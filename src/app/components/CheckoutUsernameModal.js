"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  applyEditionPrefix,
  ignKey,
  isValidMinecraftUsernameFormat,
} from "@/lib/minecraft-username";
import {
  lockCheckoutPage,
  releaseCheckoutPageLock,
} from "@/lib/checkout-page-lock";

function EditionToggle({ value, onChange, disabled }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { id: "java", label: "Java Edition", hint: "PC" },
        { id: "bedrock", label: "Bedrock", hint: "Phone / Xbox" },
      ].map((opt) => (
        <button
          key={opt.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.id)}
          className={`min-h-[52px] rounded-2xl border px-3 py-3 text-left transition-colors active:scale-[0.98] ${
            value === opt.id
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
  );
}

function UsernameField({
  id,
  label,
  hint,
  platform,
  value,
  onChange,
  disabled,
  readOnly,
  inputRef,
  onFocus,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/40"
      >
        {label}
      </label>
      <div className="relative">
        {platform === "bedrock" && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg font-bold text-cyan-400">
            .
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="text"
          enterKeyHint="go"
          autoComplete="username"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={16}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onFocus={onFocus}
          onChange={(e) =>
            onChange(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
          }
          placeholder={platform === "bedrock" ? "Steve" : "YourName"}
          className={`w-full min-h-[52px] rounded-2xl border border-white/10 bg-white/5 py-3 font-mono text-lg font-bold text-white outline-none transition-colors placeholder:text-white/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 disabled:opacity-50 ${
            platform === "bedrock" ? "pl-8 pr-4" : "px-4"
          } ${readOnly ? "cursor-default text-white/80" : ""}`}
        />
      </div>
      {hint && (
        <p className="mt-2 text-[10px] leading-snug text-white/30">{hint}</p>
      )}
    </div>
  );
}

export default function CheckoutUsernameModal({
  open,
  itemName,
  itemPrice,
  isRank = false,
  processing,
  error,
  onClose,
  onConfirm,
}) {
  const [platform, setPlatform] = useState("java");
  const [payerPlatform, setPayerPlatform] = useState("java");
  const [billing, setBilling] = useState("monthly");
  const [gift, setGift] = useState(false);
  const [giftStep, setGiftStep] = useState(1);
  const [username, setUsername] = useState("");
  const [payerUsername, setPayerUsername] = useState("");
  const [loggedInPlayer, setLoggedInPlayer] = useState("");
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);
  const giftToRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setLocalError("");
    setBilling("monthly");
    setGift(false);
    setGiftStep(1);
    let cancelled = false;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.loggedIn && data.player) {
          const raw = String(data.player);
          setLoggedInPlayer(raw);
          const bedrock = raw.startsWith(".");
          const bare = bedrock ? raw.slice(1) : raw;
          setPlatform(bedrock ? "bedrock" : "java");
          setPayerPlatform(bedrock ? "bedrock" : "java");
          setUsername(bare);
          setPayerUsername(bare);
        } else {
          setLoggedInPlayer("");
          setUsername("");
          setPayerUsername("");
          setPlatform("java");
          setPayerPlatform("java");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoggedInPlayer("");
          setUsername("");
          setPayerUsername("");
          setPlatform("java");
          setPayerPlatform("java");
        }
      });
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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

  function scrollInputIntoView(el) {
    requestAnimationFrame(() => {
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  function handleGiftToggle(next) {
    setGift(next);
    setGiftStep(1);
    setLocalError("");
    if (next) {
      if (!payerUsername && username) setPayerUsername(username);
      setUsername("");
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (loggedInPlayer) {
      const bedrock = loggedInPlayer.startsWith(".");
      setUsername(bedrock ? loggedInPlayer.slice(1) : loggedInPlayer);
    }
  }

  function goToGiftRecipient() {
    const payerName = applyEditionPrefix(payerUsername, payerPlatform);
    if (!payerName) {
      setLocalError("Enter your in-game username.");
      return false;
    }
    if (!isValidMinecraftUsernameFormat(payerName)) {
      setLocalError(
        "Use 3–16 characters: letters, numbers, and underscore only.",
      );
      return false;
    }
    setLocalError("");
    setGiftStep(2);
    setTimeout(() => giftToRef.current?.focus(), 50);
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (gift && giftStep === 1) {
      goToGiftRecipient();
      return;
    }

    const recipientName = applyEditionPrefix(username, platform);
    const payerName = gift
      ? applyEditionPrefix(payerUsername, payerPlatform)
      : recipientName;

    if (gift) {
      if (!recipientName) {
        setLocalError("Enter their in-game username.");
        return;
      }
      if (!isValidMinecraftUsernameFormat(recipientName)) {
        setLocalError(
          "Use 3–16 characters: letters, numbers, and underscore only.",
        );
        return;
      }
      if (ignKey(payerName) === ignKey(recipientName)) {
        setLocalError("Gift to a different player, or buy it for yourself.");
        return;
      }
    } else {
      if (!recipientName) {
        setLocalError("Enter your in-game username.");
        return;
      }
      if (!isValidMinecraftUsernameFormat(recipientName)) {
        setLocalError(
          "Use 3–16 characters: letters, numbers, and underscore only.",
        );
        return;
      }
    }

    setLocalError("");
    onConfirm({
      username: recipientName,
      edition: platform,
      billing,
      gift,
      payer: payerName,
      payerEdition: gift ? payerPlatform : platform,
    });
  }

  const displayError = localError || error;
  const payerLocked = Boolean(loggedInPlayer);
  const askingForRecipient = gift && giftStep === 2;

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
                {askingForRecipient
                  ? "Who is the gift for?"
                  : gift
                    ? "Enter your in-game username. You pay — they get the rank."
                    : (
                      <>
                        Enter the username you use on{" "}
                        <span className="font-bold text-purple-300">
                          zedxsmp.fun
                        </span>
                        . Items are delivered to this account in-game.
                      </>
                    )}
              </p>

              {isRank && !askingForRecipient && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
                  {[
                    { id: "monthly", label: "Pay monthly", hint: "Recurring" },
                    { id: "once", label: "1 month only", hint: "Expires after 30 days" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={processing}
                      onClick={() => setBilling(opt.id)}
                      className={`min-h-[52px] rounded-2xl border px-3 py-3 text-left transition-colors active:scale-[0.98] ${
                        billing === opt.id
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
              )}

              {!askingForRecipient && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
                  {[
                    { id: false, label: "For me", hint: "My account" },
                    { id: true, label: "Buy as a gift", hint: "Someone else" },
                  ].map((opt) => (
                    <button
                      key={String(opt.id)}
                      type="button"
                      disabled={processing}
                      onClick={() => handleGiftToggle(opt.id)}
                      className={`min-h-[52px] rounded-2xl border px-3 py-3 text-left transition-colors active:scale-[0.98] ${
                        gift === opt.id
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
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4 sm:mt-5">
                {gift && giftStep === 1 && (
                  <>
                    <EditionToggle
                      value={payerPlatform}
                      onChange={setPayerPlatform}
                      disabled={processing || payerLocked}
                    />
                    <UsernameField
                      id="mc-payer"
                      label="Your username"
                      hint={
                        payerPlatform === "bedrock"
                          ? "Bedrock players: we add the dot prefix automatically."
                          : "Use your exact Java username (no dot)."
                      }
                      platform={payerPlatform}
                      value={payerUsername}
                      onChange={(v) => {
                        setPayerUsername(v);
                        setLocalError("");
                      }}
                      disabled={processing}
                      readOnly={payerLocked}
                      inputRef={inputRef}
                      onFocus={() => scrollInputIntoView(inputRef.current)}
                    />
                  </>
                )}

                {askingForRecipient && (
                  <>
                    <EditionToggle
                      value={platform}
                      onChange={setPlatform}
                      disabled={processing}
                    />
                    <UsernameField
                      id="mc-gift-to"
                      label="Their username"
                      hint={
                        platform === "bedrock"
                          ? "We add their Bedrock dot prefix automatically."
                          : "Their exact Java username (no dot)."
                      }
                      platform={platform}
                      value={username}
                      onChange={(v) => {
                        setUsername(v);
                        setLocalError("");
                      }}
                      disabled={processing}
                      inputRef={giftToRef}
                      onFocus={() => scrollInputIntoView(giftToRef.current)}
                    />
                  </>
                )}

                {!gift && (
                  <>
                    <EditionToggle
                      value={platform}
                      onChange={setPlatform}
                      disabled={processing}
                    />
                    <UsernameField
                      id="mc-username"
                      label="In-game username"
                      hint={
                        platform === "bedrock"
                          ? "Bedrock players: we add the dot prefix automatically."
                          : "Use your exact Java username (no dot)."
                      }
                      platform={platform}
                      value={username}
                      onChange={(v) => {
                        setUsername(v);
                        setLocalError("");
                      }}
                      disabled={processing}
                      inputRef={inputRef}
                      onFocus={() => scrollInputIntoView(inputRef.current)}
                    />
                  </>
                )}

                {displayError && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium leading-relaxed text-red-300 whitespace-pre-line">
                    {displayError}
                  </p>
                )}

                {processing && (
                  <p className="text-center text-[10px] leading-relaxed text-white/40">
                    You&apos;ll complete payment on Stripe&apos;s secure page.
                    Card, Apple Pay and Google Pay are available. We&apos;ll
                    bring you back here when done.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full min-h-[52px] rounded-2xl bg-white py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-colors active:scale-[0.99] hover:bg-purple-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:tracking-[0.25em]"
                >
                  {processing
                    ? "Redirecting to Stripe…"
                    : gift && giftStep === 1
                      ? "Continue to gift payment"
                      : "Continue to payment"}
                </button>
                {askingForRecipient ? (
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => {
                      setLocalError("");
                      setGiftStep(1);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="flex min-h-[44px] w-full items-center justify-center py-2 text-[10px] font-bold uppercase tracking-widest text-white/35 transition-colors active:text-white hover:text-white/60"
                  >
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={processing}
                    onClick={onClose}
                    className="flex min-h-[44px] w-full items-center justify-center py-2 text-[10px] font-bold uppercase tracking-widest text-white/35 transition-colors active:text-white hover:text-white/60"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import PolicyModal from "@/app/components/PolicyModal";
import {
  RefundPolicyContent,
  TermsPolicyContent,
} from "@/app/components/PolicyContent";

export default function SiteFooter({ className = "" }) {
  const [openPolicy, setOpenPolicy] = useState(null);

  const close = () => setOpenPolicy(null);

  return (
    <>
      <footer
        className={`relative z-10 flex w-full max-w-6xl flex-col items-center gap-3 border-t border-white/5 py-10 ${className}`.trim()}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <button
            type="button"
            onClick={() => setOpenPolicy("terms")}
            className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/35 transition-colors hover:text-white/55"
          >
            Terms of Service
          </button>
          <span className="text-[7px] text-white/15" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={() => setOpenPolicy("refund")}
            className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/35 transition-colors hover:text-white/55"
          >
            Refund Policy
          </button>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/65">
          © 2026 ZEDXSMP · The official website
        </p>
      </footer>

      {openPolicy === "terms" && (
        <PolicyModal
          title="Terms of Service"
          subtitle="Last updated 2026 · ZEDX SMP (shop.zedxsmp.fun)"
          onClose={close}
        >
          <TermsPolicyContent />
        </PolicyModal>
      )}

      {openPolicy === "refund" && (
        <PolicyModal
          title="Refund Policy"
          subtitle="Last updated 2026 · ZEDX SMP (shop.zedxsmp.fun)"
          onClose={close}
        >
          <RefundPolicyContent />
        </PolicyModal>
      )}
    </>
  );
}

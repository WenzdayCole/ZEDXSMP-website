"use client";

import { useState } from "react";

export default function HomeFooterClient() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-4 border-t border-white/5 py-12">
        <button
          type="button"
          onClick={() => setIsTermsOpen(true)}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-purple-400"
        >
          Terms of Service
        </button>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/65">
          © 2026 ZEDXSMP · The official website
        </p>
      </footer>

      {isTermsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setIsTermsOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <h2
                id="terms-title"
                className="text-xl font-black uppercase italic tracking-tighter"
              >
                Terms of Service
              </h2>
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="text-xl text-white/50 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="custom-scrollbar overflow-y-auto p-8 text-[11px] font-bold uppercase leading-relaxed tracking-widest text-white/65">
              <section>
                <h3 className="mb-3 text-xs text-white">
                  1. Acceptance of Terms
                </h3>
                <p>By accessing ZEDX SMP, you agree to these terms.</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

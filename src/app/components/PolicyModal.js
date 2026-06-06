"use client";

import { useEffect } from "react";

export default function PolicyModal({ title, subtitle, onClose, children, wide = false }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-modal-title"
        className={`relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-2xl ${wide ? "max-w-4xl" : "max-w-2xl"}`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/5 p-6">
          <div>
            <h2
              id="policy-modal-title"
              className="text-xl font-black uppercase italic tracking-tighter md:text-2xl"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-white/40">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-xl text-white/50 transition-colors hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="custom-scrollbar overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useClientSnapshot } from "@/hooks/useClientSnapshot";

export default function HomeVisitorsOnline() {
  const playerCount = useClientSnapshot(
    () => Math.floor(Math.random() * 20) + 12,
  );

  return (
    <div className="animate-hero-fade-up animate-delay-0 mb-4 flex items-center justify-center">
      <div className="flex items-center gap-2 rounded-full border border-[#ffffff1a] bg-[#ffffff0d] px-4 py-1.5 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span
          className="inline-block min-w-[10.5rem] text-center text-[10px] font-black uppercase tabular-nums tracking-[0.2em] text-white/80"
          suppressHydrationWarning
        >
          {playerCount != null
            ? `${playerCount} Visitors Online`
            : "Connecting…"}
        </span>
      </div>
    </div>
  );
}

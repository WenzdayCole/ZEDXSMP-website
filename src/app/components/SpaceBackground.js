"use client";

import { useClientSnapshot } from "@/hooks/useClientSnapshot";

function createStarField(count) {
  return Array.from({ length: count })
    .map(() => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const opacity = Math.random() * 0.5 + 0.25;
      return `${x}vw ${y}vh rgba(255, 255, 255, ${opacity})`;
    })
    .join(", ");
}

/** Lightweight fixed starfield — fewer stars, no Framer Motion. */
export default function SpaceBackground() {
  const stars = useClientSnapshot(() => ({
    slow: createStarField(45),
    mid: createStarField(30),
    fast: createStarField(15),
  }));

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050208]"
      aria-hidden
    >
      {stars && (
        <>
          <div
            style={{ boxShadow: stars.slow }}
            className="absolute h-px w-px bg-transparent animate-parallax-infinite"
          />
          <div
            style={{ boxShadow: stars.mid }}
            className="absolute h-0.5 w-0.5 bg-transparent animate-parallax-infinite [animation-duration:80s]"
          />
          <div
            style={{ boxShadow: stars.fast }}
            className="absolute h-0.5 w-0.5 bg-transparent animate-parallax-infinite [animation-duration:40s]"
          />
        </>
      )}
    </div>
  );
}

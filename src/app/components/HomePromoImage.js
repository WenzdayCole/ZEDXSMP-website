"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const MAX_TILT = 6;

export default function HomePromoImage() {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const handleMove = (e) => {
    if (!enabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * MAX_TILT, y: x * MAX_TILT });
  };

  const handleLeave = () => {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="animate-hero-fade-up animate-delay-1450 relative mx-auto mb-16 max-w-3xl px-2">
      <div
        className="pointer-events-none absolute -inset-10 rounded-[2rem] bg-purple-600/40 blur-[60px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -inset-4 rounded-2xl bg-purple-500/25 blur-2xl"
        aria-hidden
      />
      <div
        ref={containerRef}
        className="relative [perspective:1000px]"
        onMouseEnter={() => setHovering(true)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <Image
          src="/join-zedxsmp.png"
          alt="Join ZEDXSMP now"
          width={1200}
          height={675}
          priority={false}
          className="relative w-full rounded-2xl border border-purple-500/35 shadow-[0_0_50px_rgba(168,85,247,0.5),0_0_100px_rgba(147,51,234,0.3)] will-change-transform"
          sizes="(max-width: 768px) 100vw, 768px"
          style={{
            transform: enabled
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.02 : 1})`
              : undefined,
            transition: hovering
              ? "transform 0.1s ease-out"
              : "transform 0.45s ease-out",
          }}
        />
      </div>
    </div>
  );
}

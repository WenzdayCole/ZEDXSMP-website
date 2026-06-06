"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomeHeroLogo() {
  const [stickerLanded, setStickerLanded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    const stick = () => {
      const delay = mq.matches ? 0 : 2000;
      window.setTimeout(() => setStickerLanded(true), delay);
    };

    if (document.readyState === "complete") {
      stick();
    } else {
      window.addEventListener("load", stick, { once: true });
      return () => window.removeEventListener("load", stick);
    }
  }, []);

  return (
    <h1 className="select-none text-[18vw] font-black uppercase italic leading-none tracking-tighter md:text-[12rem]">
      ZEDX{" "}
      <span className="relative inline-block align-baseline">
        <span className="relative z-0 text-purple-500 drop-shadow-[0_0_30px_#a855f780]">
          SMP
        </span>
        <Link
          href="/ranks"
          className={`sale-sticker ${stickerLanded ? (reduceMotion ? "sale-sticker--static" : "sale-sticker--landed") : ""}`}
          aria-hidden={!stickerLanded}
          tabIndex={stickerLanded ? 0 : -1}
        >
          <span className="sale-sticker-text">
            <span className="block leading-[0.95]">SALE!</span>
            <span className="mt-[0.12em] block text-[0.58em] leading-[1.05]">
              10% off Ranks
            </span>
          </span>
        </Link>
      </span>
    </h1>
  );
}

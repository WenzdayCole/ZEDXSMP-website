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
          <span className="sale-sticker-inner">
            <span className="sale-sticker-badge">Sale!</span>
            <span className="sale-sticker-off">Up to 40% off</span>
            <span className="sale-sticker-sub">Ranks</span>
          </span>
        </Link>
      </span>
    </h1>
  );
}

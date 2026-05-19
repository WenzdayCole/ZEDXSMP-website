"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        router.replace("/ranks", { scroll: false });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 z-[200] w-[min(92vw,32rem)] -translate-x-1/2 rounded-2xl border border-green-500/30 bg-green-500/10 px-6 py-4 text-center backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400">
        Payment received
      </p>
      <p className="mt-1 text-sm font-bold text-white">
        Thanks for supporting ZEDX SMP. Your rank or items should arrive shortly
        in-game.
      </p>
    </div>
  );
}

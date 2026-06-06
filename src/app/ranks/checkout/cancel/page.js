"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { consumeCheckoutReturnPath } from "@/lib/checkout-return";
import { releaseCheckoutPageLock } from "@/lib/checkout-page-lock";
import { useCheckout } from "@/context/CheckoutContext";

function CheckoutCancelBridge() {
  const router = useRouter();
  const { resetCheckoutUi } = useCheckout();

  useEffect(() => {
    releaseCheckoutPageLock();
    resetCheckoutUi();
    const returnPath = consumeCheckoutReturnPath();
    router.replace(returnPath, { scroll: false });
  }, [router, resetCheckoutUi]);

  return (
    <main className="relative z-10 flex min-h-[50vh] items-center justify-center p-6 font-sans text-white">
      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/45">
        Returning to store…
      </p>
    </main>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutCancelBridge />
    </Suspense>
  );
}

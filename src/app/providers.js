"use client";

import { Suspense } from "react";
import SiteShell from "@/app/components/SiteShell";
import CheckoutSuccessBanner from "@/app/components/CheckoutSuccessBanner";
import { CheckoutProvider } from "@/context/CheckoutContext";

export default function AppProviders({ children }) {
  return (
    <SiteShell>
      <CheckoutProvider>
        <Suspense fallback={null}>
          <CheckoutSuccessBanner />
        </Suspense>
        {children}
      </CheckoutProvider>
    </SiteShell>
  );
}

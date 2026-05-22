"use client";

import { Suspense } from "react";
import { CheckoutProvider } from "@/context/CheckoutContext";
import CheckoutSuccessBanner from "@/app/components/CheckoutSuccessBanner";

export default function RanksProviders({ children }) {
  return (
    <CheckoutProvider>
      <Suspense fallback={null}>
        <CheckoutSuccessBanner />
      </Suspense>
      {children}
    </CheckoutProvider>
  );
}

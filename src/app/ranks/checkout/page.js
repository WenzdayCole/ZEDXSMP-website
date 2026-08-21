"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import { getProduct } from "@/lib/store-products";

function CheckoutBridge() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkout } = useCheckout();
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;

    const productId = searchParams.get("productId") || searchParams.get("packageId");
    const name = searchParams.get("name") || "Rank";
    const price = searchParams.get("price") || "";

    if (productId && getProduct(productId)) {
      checkout(productId, name, { price });
    }

    router.replace("/ranks", { scroll: false });
  }, [searchParams, checkout, router]);

  return null;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutBridge />
    </Suspense>
  );
}

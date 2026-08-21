"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { flushSync } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutRedirectScreen from "@/app/components/CheckoutRedirectScreen";
import BasketBar from "@/app/components/BasketBar";
import {
  getProduct,
  onceProductId,
} from "@/lib/store-products";
import { useCheckoutPageRestore } from "@/hooks/useCheckoutPageRestore";
import { releaseCheckoutPageLock } from "@/lib/checkout-page-lock";
import { persistCheckoutReturnPath } from "@/lib/checkout-return";

const CheckoutUsernameModal = dynamic(
  () => import("@/app/components/CheckoutUsernameModal"),
  { ssr: false },
);

const CheckoutContext = createContext(null);
const BASKET_KEY = "zedx-basket";

function goToCheckout(url) {
  if (!url) return;
  persistCheckoutReturnPath();
  releaseCheckoutPageLock();
  window.location.assign(url);
}

function CheckoutReturnHandler({ onReset }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("checkout");
    if (status !== "cancelled") return;
    releaseCheckoutPageLock();
    onReset();
    const hash = window.location.hash || "";
    router.replace(`/ranks${hash}`, { scroll: false });
  }, [searchParams, router, onReset]);

  return null;
}

function CheckoutProviderInner({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BASKET_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(BASKET_KEY, JSON.stringify(items));
  }, [items, ready]);

  const resetCheckoutUi = useCallback(() => {
    setModalOpen(false);
    setPending(null);
    setProcessing(false);
    setError("");
    setLoadingId(null);
    releaseCheckoutPageLock();
  }, []);

  useCheckoutPageRestore(resetCheckoutUi);

  useEffect(() => () => releaseCheckoutPageLock(), []);

  const addItem = useCallback((productId, quantity = 1) => {
    const product = getProduct(productId);
    if (!product) return;
    setItems((current) => {
      if (product.type === "rank") {
        const withoutRanks = current.filter(
          (item) => getProduct(item.product)?.type !== "rank",
        );
        return [...withoutRanks, { product: productId, quantity: 1 }];
      }
      const existing = current.find((item) => item.product === productId);
      if (!existing) return [...current, { product: productId, quantity }];
      return current.map((item) =>
        item.product === productId
          ? { ...item, quantity: Math.min(20, item.quantity + quantity) }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.product !== productId));
  }, []);

  const clearBasket = useCallback(() => setItems([]), []);

  const checkout = useCallback((productId, itemName, { price, type } = {}) => {
    if (!getProduct(productId) && type !== "basket") {
      alert(`Unknown product for ${itemName}.`);
      return;
    }
    setLoadingId(itemName);
    setPending({
      productId,
      itemName,
      price: price || "",
      type: type || getProduct(productId)?.type || "key",
      items: null,
    });
    setError("");
    setModalOpen(true);
  }, []);

  const checkoutBasket = useCallback(() => {
    if (!items.length) return;
    setPending({
      productId: null,
      itemName: "Basket",
      price: "",
      type: "basket",
      items,
    });
    setError("");
    setModalOpen(true);
  }, [items]);

  const handleConfirm = useCallback(
    async ({ username, edition, billing }) => {
      if (!pending) return;
      setProcessing(true);
      setError("");

      try {
        let cartItems = pending.items;
        if (!cartItems) {
          let productId = pending.productId;
          if (pending.type === "rank" && billing === "once") {
            productId = onceProductId(productId);
          }
          cartItems = [{ product: productId, quantity: 1 }];
        }

        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            player: username,
            edition,
            items: cartItems,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.url) {
          throw new Error(data.error || "Could not start Stripe checkout.");
        }

        if (pending.type === "basket") clearBasket();
        flushSync(() => resetCheckoutUi());
        goToCheckout(data.url);
      } catch (err) {
        setProcessing(false);
        setError(
          err instanceof Error
            ? err.message
            : "Could not connect to the payment gateway.",
        );
      }
    },
    [pending, resetCheckoutUi, clearBasket],
  );

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      checkout,
      addItem,
      removeItem,
      checkoutBasket,
      items,
      count,
      isLoading: (name) => loadingId === name,
      loadingId,
      clearCheckoutLoading: () => setLoadingId(null),
      resetCheckoutUi,
    }),
    [
      checkout,
      addItem,
      removeItem,
      checkoutBasket,
      items,
      count,
      loadingId,
      resetCheckoutUi,
    ],
  );

  return (
    <CheckoutContext.Provider value={value}>
      <Suspense fallback={null}>
        <CheckoutReturnHandler onReset={resetCheckoutUi} />
      </Suspense>
      {children}
      <BasketBar />
      <CheckoutUsernameModal
        open={modalOpen}
        itemName={pending?.itemName}
        itemPrice={pending?.price}
        isRank={pending?.type === "rank"}
        processing={processing}
        error={error}
        onClose={resetCheckoutUi}
        onConfirm={handleConfirm}
      />
    </CheckoutContext.Provider>
  );
}

export function CheckoutProvider({ children }) {
  const [instanceKey, setInstanceKey] = useState(0);

  useEffect(() => {
    const onPageShow = (event) => {
      releaseCheckoutPageLock();
      if (event.persisted) setInstanceKey((k) => k + 1);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <CheckoutProviderInner key={instanceKey}>{children}</CheckoutProviderInner>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return ctx;
}

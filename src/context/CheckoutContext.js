"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { flushSync } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutRedirectScreen from "@/app/components/CheckoutRedirectScreen";

const CheckoutUsernameModal = dynamic(
  () => import("@/app/components/CheckoutUsernameModal"),
  { ssr: false },
);
import { buildPayCheckoutUrl } from "@/lib/tebex-js";
import { isValidPackageId, startTebexCheckout } from "@/lib/checkout-client";
import { useCheckoutPageRestore } from "@/hooks/useCheckoutPageRestore";
import { releaseCheckoutPageLock } from "@/lib/checkout-page-lock";
import { persistCheckoutReturnPath } from "@/lib/checkout-return";

const CheckoutContext = createContext(null);

function resolveCheckoutUrl(url, ident) {
  return url || buildPayCheckoutUrl(ident) || null;
}

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

function CheckoutResumeHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const wantsResume = searchParams.get("checkout") === "resume";
  const basketFromUrl = searchParams.get("basket");
  const [resuming, setResuming] = useState(
    () => wantsResume && Boolean(basketFromUrl),
  );
  const [resumeError, setResumeError] = useState(
    () =>
      wantsResume && !basketFromUrl
        ? "Missing basket after Minecraft login. Please try again."
        : "",
  );

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") !== "resume") {
        setResuming(false);
        setResumeError("");
      }
    };

    syncFromUrl();
    window.addEventListener("pageshow", syncFromUrl);
    return () => window.removeEventListener("pageshow", syncFromUrl);
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("checkout") !== "resume") return;

    const basketIdent = searchParams.get("basket");
    if (!basketIdent) {
      setResumeError("Missing basket after Minecraft login. Please try again.");
      return;
    }

    let cancelled = false;
    setResuming(true);
    setResumeError("");

    fetch("/api/tebex-checkout/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ basketIdent }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Could not continue checkout.");
        }

        const checkoutUrl = resolveCheckoutUrl(data.url, data.ident || basketIdent);
        if (!checkoutUrl) {
          throw new Error("Tebex did not return a checkout link.");
        }

        if (!cancelled) {
          router.replace("/ranks", { scroll: false });
          releaseCheckoutPageLock();
          goToCheckout(checkoutUrl);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setResumeError(
            err instanceof Error ? err.message : "Could not resume checkout.",
          );
          setResuming(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  if (!resuming && !resumeError) return null;

  if (resumeError) {
    return (
      <CheckoutRedirectScreen
        overlay
        title="Checkout interrupted"
        error={resumeError}
        backHref="/ranks"
      />
    );
  }

  return (
    <CheckoutRedirectScreen
      overlay
      title="Minecraft linked"
      message="Redirecting to Tebex to finish payment…"
      error={resumeError || undefined}
      backHref="/ranks"
    />
  );
}

function CheckoutProviderInner({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const resetCheckoutUi = useCallback(() => {
    setModalOpen(false);
    setPending(null);
    setProcessing(false);
    setError("");
    setLoadingId(null);
    releaseCheckoutPageLock();
  }, []);

  useCheckoutPageRestore(resetCheckoutUi);

  useEffect(() => {
    return () => releaseCheckoutPageLock();
  }, []);

  const closeModal = useCallback(() => {
    resetCheckoutUi();
  }, [resetCheckoutUi]);

  const checkout = useCallback(
    (packageId, itemName, { comingSoon, price } = {}) => {
      if (comingSoon) {
        alert(`${itemName} is coming soon to the ZEDX store.`);
        return;
      }

      if (!packageId || String(packageId).includes("REPLACE")) {
        alert(
          `Configuration missing: add a valid Tebex package ID for ${itemName}.`,
        );
        return;
      }

      setLoadingId(itemName);
      setPending({
        packageId: String(packageId),
        itemName,
        price: price || "",
      });
      setError("");
      setModalOpen(true);
    },
    [],
  );

  const handleConfirm = useCallback(
    async (username) => {
      if (!pending) return;

      setProcessing(true);
      setError("");

      try {
        const { url, ident, requiresAuth } = await startTebexCheckout({
          packageId: Number(pending.packageId),
          username,
          returnPath: `${window.location.pathname}${window.location.hash}`,
        });

        const checkoutUrl = resolveCheckoutUrl(url, ident);
        if ((requiresAuth || checkoutUrl) && checkoutUrl) {
          // Commit closed modal before navigation so bfcache Back does not restore a blocking overlay.
          flushSync(() => {
            resetCheckoutUi();
          });
          goToCheckout(checkoutUrl);
          return;
        }

        throw new Error("Tebex did not return a checkout link.");
      } catch (err) {
        setProcessing(false);
        setError(
          err instanceof Error
            ? err.message
            : "Could not connect to the payment gateway.",
        );
      }
    },
    [pending, resetCheckoutUi],
  );

  const value = {
    checkout,
    isLoading: (name) => loadingId === name,
    loadingId,
    clearCheckoutLoading: () => setLoadingId(null),
    resetCheckoutUi,
  };

  return (
    <CheckoutContext.Provider value={value}>
      <Suspense fallback={null}>
        <CheckoutReturnHandler onReset={resetCheckoutUi} />
        <CheckoutResumeHandler />
      </Suspense>
      {children}
      <CheckoutUsernameModal
        open={modalOpen}
        itemName={pending?.itemName}
        itemPrice={pending?.price}
        processing={processing}
        error={error}
        onClose={closeModal}
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
      if (event.persisted) {
        setInstanceKey((k) => k + 1);
      }
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

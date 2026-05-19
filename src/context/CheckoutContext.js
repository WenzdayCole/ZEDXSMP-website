"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutUsernameModal from "@/app/components/CheckoutUsernameModal";
import CheckoutRedirectScreen from "@/app/components/CheckoutRedirectScreen";
import { buildPayCheckoutUrl } from "@/lib/tebex-js";
import { isValidPackageId, startTebexCheckout } from "@/lib/checkout-client";

const CheckoutContext = createContext(null);

function resolveCheckoutUrl(url, ident) {
  return url || buildPayCheckoutUrl(ident) || null;
}

function goToCheckout(url) {
  if (!url) return;
  window.location.assign(url);
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

export function CheckoutProvider({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const closeModal = useCallback(() => {
    if (processing) return;
    setModalOpen(false);
    setPending(null);
    setError("");
    setLoadingId(null);
  }, [processing]);

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
        });

        const checkoutUrl = resolveCheckoutUrl(url, ident);
        if ((requiresAuth || checkoutUrl) && checkoutUrl) {
          setModalOpen(false);
          setPending(null);
          setLoadingId(null);
          setRedirecting(true);
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
    [pending],
  );

  const value = {
    checkout,
    isLoading: (name) => loadingId === name,
    loadingId,
    clearCheckoutLoading: () => setLoadingId(null),
  };

  return (
    <CheckoutContext.Provider value={value}>
      <Suspense fallback={null}>
        <CheckoutResumeHandler />
      </Suspense>
      {redirecting && (
        <CheckoutRedirectScreen
          overlay
          title="Almost there"
          message="Opening Tebex secure checkout. Card, PayPal, and more available there."
        />
      )}
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

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return ctx;
}

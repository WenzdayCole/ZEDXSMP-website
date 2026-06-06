import { sanitizeMinecraftUsername } from "@/lib/minecraft-username";
import { sanitizeCheckoutReturnPath } from "@/lib/checkout-return";
import { buildPayCheckoutUrl } from "@/lib/tebex-js";

function isMinecraftLoginMessage(text) {
  return /sign in with your minecraft|must login|login before adding/i.test(
    String(text || ""),
  );
}

export async function startTebexCheckout({ packageId, username, returnPath } = {}) {
  const safeReturnPath =
    typeof window !== "undefined"
      ? sanitizeCheckoutReturnPath(
          returnPath || `${window.location.pathname}${window.location.hash}`,
        )
      : "/ranks";

  const response = await fetch("/api/tebex-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      packageId: Number(packageId),
      username: sanitizeMinecraftUsername(username),
      returnOrigin:
        typeof window !== "undefined" ? window.location.origin : undefined,
      returnPath: safeReturnPath,
    }),
  });

  const contentType = response.headers.get("content-type") || "";
  let data = {};

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(
      text.includes("<!DOCTYPE")
        ? "Server error during checkout. Restart npm run dev and check .env.local."
        : text.slice(0, 200) || "Unexpected server response.",
    );
  }

  const hasUrl = Boolean(data.url);
  const hasIdent = Boolean(data.ident);

  // Minecraft login on Tebex — redirect immediately
  if (data.requiresAuth && hasUrl) {
    return {
      url: data.url,
      ident: data.ident || null,
      requiresAuth: true,
      message: data.message,
    };
  }

  const needsMinecraftLogin =
    data.requiresAuth || isMinecraftLoginMessage(data.error);

  if (needsMinecraftLogin) {
    const authUrl =
      data.url || (data.ident ? buildPayCheckoutUrl(data.ident) : null);

    if (authUrl) {
      return {
        url: authUrl,
        ident: data.ident || null,
        requiresAuth: true,
        message: data.message,
      };
    }

    if (data.fallbackUrl) {
      return {
        url: data.fallbackUrl,
        ident: data.ident || null,
        requiresAuth: true,
        usedFallback: true,
      };
    }

    throw new Error(
      data.error ||
        "Minecraft login is required. Add TEBEX_AUTH_RETURN_URL=https://zedxsmp.fun to .env.local if testing on localhost.",
    );
  }

  if (!response.ok) {
    const errText =
      data.error ||
      `Checkout failed (HTTP ${response.status}). Check the terminal for [tebex-checkout] logs.`;

    if (process.env.NODE_ENV === "development") {
      console.error(
        "[checkout-client]",
        JSON.stringify({
          status: response.status,
          error: data.error ?? null,
          hasUrl,
          hasIdent,
          requiresAuth: Boolean(data.requiresAuth),
        }),
      );
    }

    throw new Error(errText);
  }

  if (!hasUrl && !hasIdent) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[checkout-client] Tebex returned 200 but no checkout session:",
        JSON.stringify(data),
      );
    }
    throw new Error(
      data.error ||
        "Tebex did not return a checkout session. Restart the dev server and try again.",
    );
  }

  if (data.message) {
    console.info(data.message);
  }

  return {
    url: data.url || null,
    ident: data.ident || null,
    requiresAuth: Boolean(data.requiresAuth),
    message: data.message,
  };
}

export function isValidPackageId(packageId) {
  if (!packageId || String(packageId).includes("REPLACE")) return false;
  return !Number.isNaN(Number(packageId));
}

import { sanitizeMinecraftUsername } from "@/lib/minecraft-username";

export async function startTebexCheckout({ packageId, username }) {
  const response = await fetch("/api/tebex-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      packageId: Number(packageId),
      username: sanitizeMinecraftUsername(username),
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

  if (data.requiresAuth && !hasUrl) {
    throw new Error(
      data.error ||
        "Minecraft login is required. Tebex did not return a login link — check API keys in .env.local.",
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

    const loginRequired =
      /must login|login before adding/i.test(errText) && data.fallbackUrl;

    if (loginRequired) {
      window.location.href = data.fallbackUrl;
      return {
        url: data.fallbackUrl,
        ident: data.ident || null,
        requiresAuth: false,
        usedFallback: true,
      };
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

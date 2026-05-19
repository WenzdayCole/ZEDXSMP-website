import {
  getUsernameCandidates,
  sanitizeMinecraftUsername,
} from "@/lib/minecraft-username";

const TEBEX_API = "https://headless.tebex.io/api";

function extractApiError(data, status) {
  if (!data) return `Tebex HTTP ${status}`;
  if (data.title) {
    return data.detail ? `${data.title}: ${data.detail}` : data.title;
  }
  return data.message || data.error || `Tebex HTTP ${status}`;
}

function isRequiresLoginError(message) {
  const text = String(message || "").toLowerCase();
  return (
    text.includes("must login") ||
    text.includes("login before adding") ||
    text.includes("user must login")
  );
}

function isInvalidUsernameError(message) {
  const text = String(message || "").toLowerCase();
  if (text.includes("invalid username")) return true;

  const jsonStart = text.indexOf("{");
  if (jsonStart === -1) return false;

  try {
    const data = JSON.parse(text.slice(jsonStart));
    const title = String(data?.title || data?.detail || "").toLowerCase();
    return title.includes("invalid username");
  } catch {
    return false;
  }
}

function formatTebexError(message, storeUrl) {
  const text = String(message || "");
  const lower = text.toLowerCase();

  if (isRequiresLoginError(text)) {
    return "Redirecting you to sign in with your Minecraft account on Tebex…";
  }

  if (isInvalidUsernameError(text)) {
    return (
      "Tebex could not verify that Minecraft username on ZEDX SMP.\n\n" +
      "• Java Edition: use your normal name (e.g. Steve)\n" +
      "• Bedrock / phone / console: use a dot before your name (e.g. .Steve)\n" +
      "• You must have joined the server at least once\n\n" +
      "We can open Tebex login instead so you pick your account there."
    );
  }

  if (
    lower.includes("account identifier") ||
    lower.includes("webstore id") ||
    lower.includes("webstore identifier")
  ) {
    return (
      "Tebex store ID in .env.local is wrong. Copy the full Public Token from " +
      "creator.tebex.io/developers/api-keys (starts with 12pbc-)."
    );
  }

  if (lower.includes("unauthorized") || lower.includes("authentication")) {
    return (
      "Tebex rejected your API keys. Check TEBEX_PUBLIC_TOKEN and TEBEX_PRIVATE_KEY in .env.local."
    );
  }

  if (storeUrl && lower.includes("unavailable")) {
    return `Your Tebex store at ${storeUrl} is not live yet. Finish setup in the Tebex Creator panel.`;
  }

  return text || "Tebex checkout failed.";
}

export function getTebexConfig() {
  const webstoreId = (
    process.env.TEBEX_WEBSTORE_ID || process.env.TEBEX_PUBLIC_TOKEN
  )?.trim();
  const publicToken = (
    process.env.TEBEX_PUBLIC_TOKEN || process.env.TEBEX_WEBSTORE_ID
  )?.trim();
  const privateKey = (
    process.env.TEBEX_PRIVATE_KEY || process.env.TEBEX_SECRET_KEY
  )?.trim();
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const storeUrl = (
    process.env.NEXT_PUBLIC_TEBEX_STORE_URL || "https://zedxsmp-shop.tebex.io"
  ).replace(/\/$/, "");

  if (!webstoreId) {
    return {
      ok: false,
      error:
        "TEBEX_WEBSTORE_ID is missing. Add it from creator.tebex.io/developers/api-keys",
    };
  }

  if (!privateKey) {
    return { ok: false, error: "TEBEX_PRIVATE_KEY is missing from .env.local" };
  }

  if (!publicToken) {
    return { ok: false, error: "TEBEX_PUBLIC_TOKEN is missing from .env.local" };
  }

  return { ok: true, webstoreId, publicToken, privateKey, siteUrl, storeUrl };
}

function authHeaders(publicToken, privateKey) {
  const credentials = Buffer.from(`${publicToken}:${privateKey}`).toString(
    "base64",
  );
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Basic ${credentials}`,
  };
}

export async function parseTebexResponse(response) {
  const text = await response.text();
  const trimmed = text.trim();
  const contentType = response.headers.get("content-type") || "";
  const looksJson =
    trimmed.startsWith("{") ||
    trimmed.startsWith("[") ||
    contentType.includes("json");

  if (looksJson && trimmed) {
    try {
      return {
        ok: true,
        status: response.status,
        data: JSON.parse(trimmed),
      };
    } catch {
      return {
        ok: false,
        status: response.status,
        error: "Tebex returned invalid JSON.",
      };
    }
  }

  const preview = text.slice(0, 160).replace(/\s+/g, " ");
  return {
    ok: false,
    status: response.status,
    error: `Tebex HTTP ${response.status}: ${preview || "non-JSON response"}`,
  };
}

function unwrapBasket(payload) {
  return payload?.data ?? payload;
}

export function buildPayCheckoutUrl(basketIdent) {
  if (!basketIdent) return null;
  return `https://pay.tebex.io/${encodeURIComponent(String(basketIdent))}`;
}

function getCheckoutUrl(basket) {
  const direct = basket?.links?.checkout;
  if (direct) return direct;

  const ident = basket?.ident ?? null;
  return buildPayCheckoutUrl(ident);
}

function parseAuthLinks(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.url) return [payload];
  return [];
}

export function getHostedStorePackageUrl(storeUrl, packageId) {
  return `${storeUrl}/package/${packageId}`;
}

export async function validateTebexWebstore(webstoreId) {
  const response = await fetch(`${TEBEX_API}/accounts/${webstoreId}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const parsed = await parseTebexResponse(response);

  if (!parsed.ok) {
    return { ok: false, error: parsed.error, status: parsed.status || 502 };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: extractApiError(parsed.data, response.status),
      invalidWebstore: response.status === 404 || response.status === 422,
    };
  }

  const store = unwrapBasket(parsed.data);
  return { ok: true, name: store?.name, url: store?.webstore_url };
}

export async function createTebexBasket({
  webstoreId,
  publicToken,
  privateKey,
  username,
  siteUrl,
  clientIp,
  storeUrl,
}) {
  const body = {
    complete_url: `${siteUrl}/ranks?checkout=success`,
    cancel_url: `${siteUrl}/ranks`,
    complete_auto_redirect: true,
    ip_address: clientIp,
  };

  if (username) {
    body.username = sanitizeMinecraftUsername(username);
  }

  const response = await fetch(
    `${TEBEX_API}/accounts/${webstoreId}/baskets`,
    {
      method: "POST",
      headers: authHeaders(publicToken, privateKey),
      body: JSON.stringify(body),
    },
  );

  const parsed = await parseTebexResponse(response);
  if (!parsed.ok) {
    return {
      ok: false,
      error: formatTebexError(parsed.error, storeUrl),
      status: parsed.status || 502,
      invalidUsername: isInvalidUsernameError(parsed.error),
    };
  }

  if (!response.ok) {
    const message = extractApiError(parsed.data, response.status);
    return {
      ok: false,
      status: response.status,
      error: formatTebexError(message, storeUrl),
      invalidUsername: isInvalidUsernameError(message),
    };
  }

  const basket = unwrapBasket(parsed.data);
  const ident = basket?.ident;

  if (!ident) {
    return {
      ok: false,
      status: 500,
      error: "Tebex did not return a basket identifier.",
    };
  }

  return { ok: true, ident, usernameId: basket?.username_id ?? null };
}

async function createBasketWithUsernameFallbacks(options) {
  const { username, ...rest } = options;

  if (!username) {
    return createTebexBasket({ ...rest, username: null });
  }

  let lastResult = null;
  for (const candidate of getUsernameCandidates(username)) {
    const result = await createTebexBasket({ ...rest, username: candidate });
    if (result.ok) return result;
    lastResult = result;
    if (!result.invalidUsername) return result;
  }

  return lastResult;
}

export async function addTebexPackage({
  publicToken,
  privateKey,
  basketIdent,
  packageId,
  usernameId,
  variableUsername,
}) {
  const body = {
    package_id: String(packageId),
    quantity: 1,
  };

  if (usernameId) {
    body.variable_data = { username_id: String(usernameId) };
  } else if (variableUsername) {
    body.variable_data = { username: sanitizeMinecraftUsername(variableUsername) };
  }

  const response = await fetch(
    `${TEBEX_API}/baskets/${basketIdent}/packages`,
    {
      method: "POST",
      headers: authHeaders(publicToken, privateKey),
      body: JSON.stringify(body),
    },
  );

  const parsed = await parseTebexResponse(response);
  if (!parsed.ok) {
    return {
      ok: false,
      error: formatTebexError(parsed.error),
      status: parsed.status || 502,
      invalidUsername: isInvalidUsernameError(parsed.error),
    };
  }

  if (!response.ok) {
    const message = extractApiError(parsed.data, response.status);
    return {
      ok: false,
      status: response.status,
      error: formatTebexError(message),
      invalidUsername: isInvalidUsernameError(message),
      requiresLogin: isRequiresLoginError(message),
    };
  }

  return { ok: true, basket: unwrapBasket(parsed.data) };
}

async function addPackageWithUsernameFallbacks({
  publicToken,
  privateKey,
  basketIdent,
  packageId,
  username,
  usernameId,
}) {
  const attempts = [];

  if (usernameId) {
    attempts.push({ usernameId, variableUsername: null });
  }

  if (username) {
    for (const candidate of getUsernameCandidates(username)) {
      attempts.push({ usernameId: null, variableUsername: candidate });
    }
  }

  attempts.push({ usernameId: null, variableUsername: null });

  let lastResult = null;
  for (const attempt of attempts) {
    const result = await addTebexPackage({
      publicToken,
      privateKey,
      basketIdent,
      packageId,
      ...attempt,
    });
    if (result.ok) return result;
    lastResult = result;
    if (result.requiresLogin) return result;
    if (!result.invalidUsername) return result;
  }

  return lastResult;
}

export function buildAuthReturnUrl(siteUrl, basketIdent) {
  return `${siteUrl}/ranks?checkout=resume&basket=${encodeURIComponent(basketIdent)}`;
}

export async function resumeTebexCheckoutSession({ basketIdent }) {
  const config = getTebexConfig();
  if (!config.ok) {
    return { ok: false, status: 500, error: config.error };
  }

  const { webstoreId, publicToken, privateKey } = config;
  const refreshed = await getTebexBasket({
    webstoreId,
    publicToken,
    privateKey,
    basketIdent,
  });

  if (!refreshed.ok) {
    return {
      ok: false,
      status: 500,
      error: refreshed.error || "Could not load your basket.",
    };
  }

  const checkoutUrl = getCheckoutUrl(refreshed.basket);
  if (!checkoutUrl) {
    return {
      ok: false,
      status: 500,
      error: "Basket is not ready for payment yet. Try purchasing again.",
    };
  }

  return { ok: true, url: checkoutUrl, ident: basketIdent };
}

async function authCheckoutRedirect({
  webstoreId,
  publicToken,
  privateKey,
  basketIdent,
  siteUrl,
  message,
}) {
  const returnUrl = buildAuthReturnUrl(siteUrl, basketIdent);
  const auth = await getTebexAuthUrl({
    webstoreId,
    publicToken,
    privateKey,
    basketIdent,
    returnUrl,
  });

  if (!auth.ok) {
    return { ok: false, error: auth.error };
  }

  return {
    ok: true,
    url: auth.url,
    ident: basketIdent,
    requiresAuth: true,
    message:
      message ||
      "Sign in with your Minecraft account on Tebex to continue checkout.",
  };
}

export async function getTebexBasket({
  webstoreId,
  publicToken,
  privateKey,
  basketIdent,
}) {
  const response = await fetch(
    `${TEBEX_API}/accounts/${webstoreId}/baskets/${basketIdent}`,
    {
      headers: authHeaders(publicToken, privateKey),
      cache: "no-store",
    },
  );

  const parsed = await parseTebexResponse(response);
  if (!parsed.ok || !response.ok) {
    return {
      ok: false,
      error:
        parsed.error ||
        extractApiError(parsed.data, response.status) ||
        "Failed to load basket.",
    };
  }

  return { ok: true, basket: unwrapBasket(parsed.data) };
}

export async function getTebexAuthUrl({
  webstoreId,
  publicToken,
  privateKey,
  basketIdent,
  returnUrl,
}) {
  const url = `${TEBEX_API}/accounts/${webstoreId}/baskets/${basketIdent}/auth?returnUrl=${encodeURIComponent(returnUrl)}`;

  const response = await fetch(url, {
    headers: authHeaders(publicToken, privateKey),
    cache: "no-store",
  });

  const parsed = await parseTebexResponse(response);
  if (!parsed.ok || !response.ok) {
    return {
      ok: false,
      error: parsed.error || extractApiError(parsed.data, response.status),
    };
  }

  const links = parseAuthLinks(parsed.data);
  const minecraft =
    links.find((link) =>
      /minecraft|mojang|xbox|bedrock|java/i.test(String(link?.name || "")),
    ) ?? links[0];

  if (!minecraft?.url) {
    return {
      ok: false,
      error:
        links.length === 0
          ? "Tebex did not return a Minecraft login URL."
          : "Tebex login URL missing. Try again or use the Tebex store link.",
    };
  }

  return { ok: true, url: minecraft.url };
}

export async function createTebexCheckoutSession({
  packageId,
  username,
  clientIp,
}) {
  const config = getTebexConfig();
  if (!config.ok) {
    return { ok: false, status: 500, error: config.error };
  }

  const { webstoreId, publicToken, privateKey, siteUrl, storeUrl } = config;
  const fallbackUrl = getHostedStorePackageUrl(storeUrl, packageId);
  const successReturnUrl = `${siteUrl}/ranks?checkout=success`;

  const webstore = await validateTebexWebstore(webstoreId);
  if (!webstore.ok) {
    return {
      ok: false,
      status: webstore.status || 500,
      error: formatTebexError(webstore.error, storeUrl),
      fallbackUrl,
    };
  }

  const basketOpts = {
    webstoreId,
    publicToken,
    privateKey,
    siteUrl,
    clientIp,
    storeUrl,
  };

  // Prefer username on basket when provided (links Minecraft account for package add).
  let basket = username
    ? await createBasketWithUsernameFallbacks({ ...basketOpts, username })
    : null;

  if (!basket?.ok) {
    basket = await createTebexBasket({ ...basketOpts, username: null });
  }

  if (!basket.ok) {
    return {
      ok: false,
      status: basket.status || 500,
      error: basket.error,
      fallbackUrl,
    };
  }

  const added = await addPackageWithUsernameFallbacks({
    publicToken,
    privateKey,
    basketIdent: basket.ident,
    packageId,
    username,
    usernameId: basket.usernameId,
  });

  if (!added.ok) {
    if (added.requiresLogin || isRequiresLoginError(added.error)) {
      const authRedirect = await authCheckoutRedirect({
        webstoreId,
        publicToken,
        privateKey,
        basketIdent: basket.ident,
        siteUrl,
        message:
          "Tebex needs you to sign in with Minecraft once before checkout.",
      });
      if (authRedirect.ok) return authRedirect;
    }

    const authRedirect = await authCheckoutRedirect({
      webstoreId,
      publicToken,
      privateKey,
      basketIdent: basket.ident,
      siteUrl,
    });
    if (authRedirect.ok) return authRedirect;

    return {
      ok: false,
      status: added.status || 500,
      error: added.error,
      fallbackUrl,
    };
  }

  let checkoutUrl = getCheckoutUrl(added.basket);

  if (!checkoutUrl) {
    const refreshed = await getTebexBasket({
      webstoreId,
      publicToken,
      privateKey,
      basketIdent: basket.ident,
    });
    checkoutUrl = getCheckoutUrl(refreshed.basket);
  }

  if (checkoutUrl) {
    return { ok: true, url: checkoutUrl, ident: basket.ident };
  }

  // Package is in basket — ident is enough for Tebex.js; derive hosted URL if missing
  if (basket.ident) {
    return {
      ok: true,
      url: buildPayCheckoutUrl(basket.ident),
      ident: basket.ident,
    };
  }

  const authRedirect = await authCheckoutRedirect({
    webstoreId,
    publicToken,
    privateKey,
    basketIdent: basket.ident,
    siteUrl,
  });
  if (authRedirect.ok) return authRedirect;

  return {
    ok: false,
    status: 500,
    error:
      "Could not start checkout. Try the Tebex store page instead.",
    fallbackUrl,
  };
}

/** Store app is on shop.zedxsmp.fun — root zedxsmp.fun has no valid app SSL. */
export function normalizeSiteOrigin(siteUrl) {
  const trimmed = String(siteUrl || "").trim().replace(/\/$/, "");
  if (!trimmed) return "https://shop.zedxsmp.fun";

  try {
    const url = new URL(
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`,
    );
    if (url.hostname === "zedxsmp.fun") {
      url.hostname = "shop.zedxsmp.fun";
    }
    if (url.hostname === "shop.zedxsmp.fun") {
      url.protocol = "https:";
    }
    return `${url.protocol}//${url.host}`;
  } catch {
    return trimmed;
  }
}

export function getSiteUrl() {
  return normalizeSiteOrigin(
    process.env.NEXT_PUBLIC_SITE_URL || "https://shop.zedxsmp.fun",
  );
}

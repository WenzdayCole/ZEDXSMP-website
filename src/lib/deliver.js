function storeUrl() {
  return (process.env.ZEDX_STORE_URL || "").trim();
}

function storeSecret() {
  return (process.env.ZEDX_STORE_SECRET || "").trim();
}

export async function deliverToPlugin({ player, product, orderId, lineId, edition }) {
  const url = storeUrl();
  const secret = storeSecret();
  if (!url || !secret) {
    throw new Error("ZEDX_STORE_URL or ZEDX_STORE_SECRET is not set.");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      player,
      product,
      order_id: orderId,
      line_id: lineId,
      edition,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ZedxWebStore ${res.status}: ${text || res.statusText}`);
  }
}

export async function deliverLines({ player, edition, orderId, lines, revoke = false }) {
  for (let i = 0; i < lines.length; i++) {
    const { product, quantity } = lines[i];
    const qty = revoke ? 1 : quantity || 1;
    for (let n = 0; n < qty; n++) {
      const productId = revoke
        ? product.removeProduct || `${product.id}-remove`
        : product.id;
      await deliverToPlugin({
        player,
        product: productId,
        orderId,
        lineId: `${orderId}:${productId}:${i}:${n}`,
        edition,
      });
    }
  }
}

export function parseCartMetadata(metadata = {}) {
  const player = metadata.player || "";
  const edition = metadata.edition || "java";
  let items = [];
  try {
    items = JSON.parse(metadata.cart || "[]");
  } catch {
    if (metadata.product) items = [{ product: metadata.product, quantity: 1 }];
  }
  return { player, edition, items };
}

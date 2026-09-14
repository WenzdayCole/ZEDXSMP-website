/** Plugin product ids — must match ZedxWebStore config.yml (you set the commands). */

export const PRODUCTS = {
  "rank-vip": {
    id: "rank-vip",
    name: "VIP RANK",
    type: "rank",
    mode: "subscription",
    amountPence: 400,
    interval: "month",
    removeProduct: "rank-vip-remove",
  },
  "rank-vip-1mo": {
    id: "rank-vip-1mo",
    name: "VIP RANK (1 month)",
    type: "rank",
    mode: "payment",
    amountPence: 400,
  },
  "rank-mvp": {
    id: "rank-mvp",
    name: "MVP RANK",
    type: "rank",
    mode: "subscription",
    amountPence: 800,
    interval: "month",
    removeProduct: "rank-mvp-remove",
  },
  "rank-mvp-1mo": {
    id: "rank-mvp-1mo",
    name: "MVP RANK (1 month)",
    type: "rank",
    mode: "payment",
    amountPence: 800,
  },
  "rank-zedx": {
    id: "rank-zedx",
    name: "ZEDX RANK",
    type: "rank",
    mode: "subscription",
    amountPence: 1000,
    interval: "month",
    removeProduct: "rank-zedx-remove",
  },
  "rank-zedx-1mo": {
    id: "rank-zedx-1mo",
    name: "ZEDX RANK (1 month)",
    type: "rank",
    mode: "payment",
    amountPence: 1000,
  },
  "rank-zedxplus": {
    id: "rank-zedxplus",
    name: "ZEDX+ RANK",
    type: "rank",
    mode: "subscription",
    amountPence: 1500,
    interval: "month",
    removeProduct: "rank-zedxplus-remove",
  },
  "rank-zedxplus-1mo": {
    id: "rank-zedxplus-1mo",
    name: "ZEDX+ RANK (1 month)",
    type: "rank",
    mode: "payment",
    amountPence: 1500,
  },
  "rank-knight": {
    id: "rank-knight",
    name: "KNIGHT RANK",
    type: "rank",
    mode: "subscription",
    amountPence: 3000,
    interval: "month",
    removeProduct: "rank-knight-remove",
  },
  "rank-knight-1mo": {
    id: "rank-knight-1mo",
    name: "KNIGHT RANK (1 month)",
    type: "rank",
    mode: "payment",
    amountPence: 3000,
  },
  "key-common": {
    id: "key-common",
    name: "Common Crate Key",
    type: "key",
    mode: "payment",
    amountPence: 119,
  },
  "key-epic": {
    id: "key-epic",
    name: "Epic Crate Key",
    type: "key",
    mode: "payment",
    amountPence: 359,
  },
  "key-rare": {
    id: "key-rare",
    name: "Rare Crate Key",
    type: "key",
    mode: "payment",
    amountPence: 479,
  },
  "key-legendary": {
    id: "key-legendary",
    name: "Legendary Crate Key",
    type: "key",
    mode: "payment",
    amountPence: 599,
  },
  "key-shadow": {
    id: "key-shadow",
    name: "Shadow Crate Key",
    type: "key",
    mode: "payment",
    amountPence: 699,
  },
  "key-zedxplus": {
    id: "key-zedxplus",
    name: "ZEDX+ Crate Key",
    type: "key",
    mode: "payment",
    amountPence: 1299,
  },
};

export const RANK_SLUG_TO_PRODUCT = {
  vip: "rank-vip",
  mvp: "rank-mvp",
  zedx: "rank-zedx",
  "zedx-plus": "rank-zedxplus",
  knight: "rank-knight",
};

export const KEY_NAME_TO_PRODUCT = {
  Common: "key-common",
  Epic: "key-epic",
  Rare: "key-rare",
  Legendary: "key-legendary",
  Shadow: "key-shadow",
  Amethyst: "key-shadow",
  "ZEDX+": "key-zedxplus",
};

/** Old store/webhook ids still resolve to the current product. */
const PRODUCT_ALIASES = {
  "key-amethyst": "key-shadow",
};

export function getProduct(id) {
  if (!id) return null;
  return PRODUCTS[id] || PRODUCTS[PRODUCT_ALIASES[id]] || null;
}

export function onceProductId(monthlyId) {
  if (!monthlyId) return null;
  if (monthlyId.endsWith("-1mo")) return monthlyId;
  return `${monthlyId}-1mo`;
}

export function formatGbp(pence) {
  return `£${(pence / 100).toFixed(2)}`;
}

export function validateCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "Your basket is empty.";
  }

  const ranks = new Set();
  for (const item of items) {
    const product = getProduct(item.product);
    const qty = Number(item.quantity) || 0;
    if (!product) return `Unknown product: ${item.product}`;
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      return "Quantity must be between 1 and 20.";
    }
    if (product.type === "rank") {
      ranks.add(product.id.replace(/-1mo$/, ""));
      if (qty !== 1) return "Ranks can only be purchased one at a time.";
    }
  }
  if (ranks.size > 1) return "Choose a single rank per checkout.";
  return null;
}

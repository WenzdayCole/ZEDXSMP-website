const GBP_PRICE = /£([\d.]+)/;

function parseGbp(priceStr) {
  const match = priceStr?.match(GBP_PRICE);
  if (!match) return null;
  const amount = parseFloat(match[1]);
  return Number.isFinite(amount) ? amount : null;
}

/** Discount % from display-only was/sale prices (rounded). */
export function getRankSaleDiscountPercent(wasPrice, salePrice) {
  const was = parseGbp(wasPrice);
  const sale = parseGbp(salePrice);
  if (!was || !sale || sale >= was) return null;
  return Math.round((1 - sale / was) * 100);
}

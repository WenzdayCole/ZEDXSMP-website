"use client";

import { formatGbp, getProduct } from "@/lib/store-products";
import { useCheckout } from "@/context/CheckoutContext";

export default function BasketBar() {
  const { items, count, removeItem, checkoutBasket } = useCheckout();
  if (!count) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[80] w-[min(42rem,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0a0612]/95 p-4 shadow-[0_0_40px_rgba(147,51,234,0.2)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-purple-400">
          Basket · {count}
        </p>
        <button
          type="button"
          onClick={checkoutBasket}
          className="rounded-xl bg-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:bg-purple-500 hover:text-white"
        >
          Checkout
        </button>
      </div>
      <ul className="max-h-32 space-y-1 overflow-auto">
        {items.map((item) => {
          const product = getProduct(item.product);
          if (!product) return null;
          return (
            <li
              key={item.product}
              className="flex items-center justify-between text-[11px] font-bold text-white/70"
            >
              <span>
                {product.name}
                {item.quantity > 1 ? ` ×${item.quantity}` : ""}
                {product.mode === "subscription" ? " /mo" : ""}
              </span>
              <span className="flex items-center gap-3">
                <span className="font-mono">
                  {formatGbp(product.amountPence * item.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.product)}
                  className="text-white/30 hover:text-red-400"
                  aria-label={`Remove ${product.name}`}
                >
                  ×
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

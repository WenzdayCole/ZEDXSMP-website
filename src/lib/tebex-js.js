const TEBEX_SCRIPT = "https://js.tebex.io/v/1.js";

export const TEBEX_CHECKOUT_THEME = {
  theme: "dark",
  locale: "en_US",
  closeOnPaymentComplete: true,
  colors: [
    { name: "primary", color: "#9333ea" },
    { name: "secondary", color: "#00c3ff" },
  ],
};

export function buildPayCheckoutUrl(basketIdent) {
  if (!basketIdent) return null;
  return `https://pay.tebex.io/${encodeURIComponent(String(basketIdent))}`;
}

let scriptPromise = null;
const activeSessions = new Map();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function loadTebexJs() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Tebex.js runs in the browser only."));
  }

  if (window.Tebex?.checkout) {
    return Promise.resolve(window.Tebex);
  }

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${TEBEX_SCRIPT}"]`);
    if (existing) {
      const done = () => {
        if (window.Tebex?.checkout) resolve(window.Tebex);
        else reject(new Error("Tebex checkout API unavailable."));
      };
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Tebex checkout.")),
        { once: true },
      );
      if (window.Tebex?.checkout) resolve(window.Tebex);
      return;
    }

    const script = document.createElement("script");
    script.src = TEBEX_SCRIPT;
    script.defer = true;
    script.onload = () => {
      if (window.Tebex?.checkout) resolve(window.Tebex);
      else reject(new Error("Tebex checkout API unavailable."));
    };
    script.onerror = () => reject(new Error("Failed to load Tebex checkout."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

function measureEmbedSize(container) {
  const rect = container.getBoundingClientRect();
  const width = Math.floor(Math.max(rect.width, 320));
  const height = Math.floor(Math.max(rect.height, 640, window.innerHeight * 0.72));
  return { width, height };
}

function waitForContainerSize(container, attempts = 50) {
  return new Promise((resolve, reject) => {
    let n = 0;
    const tick = () => {
      const { width, height } = measureEmbedSize(container);
      if (width >= 320 && height >= 480) {
        resolve({ width, height });
        return;
      }
      n += 1;
      if (n >= attempts) {
        reject(new Error("Checkout panel could not be sized."));
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function findCheckoutIframe(container) {
  if (!container) return null;
  for (const iframe of container.querySelectorAll("iframe")) {
    const rect = iframe.getBoundingClientRect();
    const src = (iframe.getAttribute("src") || iframe.src || "").trim();
    if (
      rect.width > 200 &&
      rect.height > 200 &&
      src &&
      src !== "about:blank"
    ) {
      return iframe;
    }
  }
  return null;
}

async function waitForCheckoutIframe(container, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (findCheckoutIframe(container)) return true;
    await sleep(150);
  }
  return Boolean(findCheckoutIframe(container));
}

function isPaymentCompleteMessage(data) {
  if (!data) return false;
  if (typeof data === "string") {
    const lower = data.toLowerCase();
    return (
      lower.includes("payment") &&
      (lower.includes("complete") || lower.includes("success"))
    );
  }
  if (typeof data === "object") {
    const type = String(data.type || data.event || data.name || "").toLowerCase();
    const status = String(data.status || "").toLowerCase();
    return (
      type.includes("payment") &&
      (type.includes("complete") || status === "complete" || status === "success")
    );
  }
  return false;
}

function attachPaymentListeners(onPaymentComplete) {
  let completed = false;

  const finish = () => {
    if (completed) return;
    completed = true;
    onPaymentComplete?.();
  };

  const onMessage = (event) => {
    if (!event.origin.includes("tebex.io")) return;
    if (isPaymentCompleteMessage(event.data)) finish();
  };

  window.addEventListener("message", onMessage);

  return {
    bindCheckout(checkout, ident) {
      if (!checkout || !ident) return () => {};

      checkout.init({ ident, ...TEBEX_CHECKOUT_THEME });

      const events = [
        "payment:complete",
        "payment_complete",
        "payment.complete",
        "close",
      ];

      const handlers = events.map((eventName) => {
        const handler = () => {
          if (eventName === "close") return;
          finish();
        };
        checkout.on(eventName, handler);
        return { eventName, handler };
      });

      return () => {
        for (const { eventName, handler } of handlers) {
          checkout.off?.(eventName, handler);
        }
      };
    },
    destroy() {
      window.removeEventListener("message", onMessage);
    },
    finish,
  };
}

async function mountWithRenderApi({
  ident,
  container,
  checkout,
  listeners,
}) {
  const unbind = listeners.bindCheckout(checkout, ident);
  const { width, height } = await waitForContainerSize(container);

  container.replaceChildren();
  checkout.render(container, width, height, false);

  let ready = await waitForCheckoutIframe(container, 10000);
  if (ready) {
    await sleep(800);
    ready = Boolean(findCheckoutIframe(container));
  }

  return { ready, unbind };
}

export async function mountTebexCheckoutEmbed({
  ident,
  container,
  checkoutUrl,
  onPaymentComplete,
}) {
  if (!container) {
    throw new Error("Checkout container missing.");
  }

  const hostedUrl = checkoutUrl || buildPayCheckoutUrl(ident) || null;

  if (!ident && !hostedUrl) {
    throw new Error("Missing checkout session.");
  }

  let disposed = false;
  const listeners = attachPaymentListeners(() => {
    if (!disposed) onPaymentComplete?.();
  });

  const destroy = () => {
    disposed = true;
    listeners.destroy();
    activeSessions.get(ident)?.unbind?.();
    activeSessions.delete(ident);
    container.replaceChildren();
  };

  await waitForContainerSize(container);
  if (disposed) throw new Error("Checkout cancelled.");

  if (ident) {
    const Tebex = await loadTebexJs();
    const checkout = Tebex.checkout;

    const result = await mountWithRenderApi({
      ident,
      container,
      checkout,
      listeners,
    });

    if (result.ready) {
      activeSessions.set(ident, { unbind: result.unbind });
      return {
        mode: "render",
        hostedUrl,
        render: () => {},
        destroy,
      };
    }

    result.unbind?.();
    container.replaceChildren();
  }

  if (ident && !disposed) {
    const Tebex = await loadTebexJs();
    const unbind = listeners.bindCheckout(Tebex.checkout, ident);
    activeSessions.set(ident, { unbind });
    Tebex.checkout.launch();

    return {
      mode: "popup",
      hostedUrl,
      render: () => {},
      destroy,
    };
  }

  throw new Error("Could not load checkout.");
}

export function openHostedCheckout(url) {
  if (url) window.location.assign(url);
}

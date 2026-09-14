import { NextResponse } from "next/server";
import { pingAuthHealth, pingStoreHealth } from "@/lib/zedx-auth";

export const dynamic = "force-dynamic";

function stripeReady() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  const hook = process.env.STRIPE_WEBHOOK_SECRET || "";
  return Boolean(key) && !key.includes("PASTE_AFTER") && Boolean(hook) && !hook.includes("PASTE_AFTER");
}

export async function GET() {
  const [store, auth] = await Promise.all([pingStoreHealth(), pingAuthHealth()]);
  const stripe = stripeReady();
  const ok = store.ok && auth.ok;
  const production = process.env.NODE_ENV === "production";
  return NextResponse.json({
    ok,
    stripe: { configured: stripe },
    store: production ? { ok: store.ok } : store,
    auth: production ? { ok: auth.ok } : auth,
    checkout: "stripe",
  });
}

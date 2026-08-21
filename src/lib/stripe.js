import Stripe from "stripe";
import { getSiteUrl } from "@/lib/site-url";

let stripe;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("PASTE_AFTER")) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  if (!stripe) stripe = new Stripe(key);
  return stripe;
}

export function checkoutOrigin(request) {
  const host = request.headers.get("host") || "";
  if (host.includes("localhost") || host.startsWith("192.168.")) {
    return request.nextUrl.origin;
  }
  return getSiteUrl();
}

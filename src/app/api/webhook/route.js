import { NextResponse } from "next/server";
import { deliverLines, parseCartMetadata } from "@/lib/deliver";
import { getProduct } from "@/lib/store-products";
import { getStripe } from "@/lib/stripe";
import {
  cancelOtherRankSubscriptions,
  stripeObjectId,
} from "@/lib/stripe-billing";

export const runtime = "nodejs";

const FULFILLED_KEY = "zedx_fulfilled";
const REVOKED_KEY = "zedx_revoked";

function subscriptionIdFromInvoice(invoice) {
  const parent = invoice.parent?.subscription_details?.subscription;
  const raw = parent || invoice.subscription;
  if (!raw) return null;
  return typeof raw === "string" ? raw : raw.id;
}

async function fulfillCart({ metadata, orderId, revoke = false, rankOnly = false }) {
  const { player, edition, items } = parseCartMetadata(metadata);
  if (!player) throw new Error("Missing player in Stripe metadata.");

  let lines = items
    .map((item) => ({
      product: getProduct(item.product),
      quantity: Number(item.quantity) || 1,
    }))
    .filter((line) => line.product);

  if (rankOnly) lines = lines.filter((line) => line.product.type === "rank");
  if (revoke) {
    lines = lines
      .filter((line) => line.product.type === "rank" && line.product.mode === "subscription")
      .map((line) => ({ ...line, quantity: 1 }));
  }
  if (lines.length === 0 && metadata.product) {
    const product = getProduct(metadata.product);
    if (product) lines = [{ product, quantity: 1 }];
  }
  if (lines.length === 0) {
    throw new Error("No deliverable products on this order.");
  }

  await deliverLines({ player, edition, orderId, lines, revoke, rankOnly });
  return { player, lines };
}

function alreadyDone(metadata, key) {
  return Boolean(metadata?.[key]);
}

export async function POST(req) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || secret.includes("PASTE_AFTER")) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set." },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.status !== "complete") break;
        if (session.mode === "payment" && session.payment_status !== "paid") break;
        if (alreadyDone(session.metadata, FULFILLED_KEY)) break;

        const customerId = stripeObjectId(session.customer);
        const payer =
          session.metadata?.payer || session.metadata?.player || "";
        if (customerId && payer) {
          await stripe.customers.update(customerId, {
            metadata: {
              payer,
              player: payer,
            },
          });
        }

        await fulfillCart({ metadata: session.metadata, orderId: session.id });
        const rankLine =
          parseCartMetadata(session.metadata)
            .items.map((item) => getProduct(item.product))
            .find((product) => product?.type === "rank") ||
          (getProduct(session.metadata?.product)?.type === "rank"
            ? getProduct(session.metadata.product)
            : null);
        // Gifts must not cancel the payer's own rank. Never cancel by IGN.
        if (rankLine && session.metadata?.gift !== "1") {
          const subscriptionId = stripeObjectId(session.subscription);
          await cancelOtherRankSubscriptions(stripe, {
            customerId,
            keepProductId: rankLine.id,
            keepSubscriptionId: subscriptionId,
          });
        }
        await stripe.checkout.sessions.update(session.id, {
          metadata: {
            ...(session.metadata || {}),
            [FULFILLED_KEY]: event.id,
          },
        });
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object;
        if (invoice.billing_reason !== "subscription_cycle") break;
        if (alreadyDone(invoice.metadata, FULFILLED_KEY)) break;

        const snapshot = invoice.parent?.subscription_details?.metadata;
        const subscriptionId = subscriptionIdFromInvoice(invoice);
        const metadata =
          snapshot ||
          (subscriptionId
            ? (await stripe.subscriptions.retrieve(subscriptionId)).metadata
            : null);
        if (!metadata) break;

        await fulfillCart({ metadata, orderId: invoice.id, rankOnly: true });
        const rankProduct = getProduct(metadata.product);
        if (rankProduct?.type === "rank" && metadata.gift !== "1") {
          await cancelOtherRankSubscriptions(stripe, {
            customerId: stripeObjectId(invoice.customer),
            keepProductId: rankProduct.id,
            keepSubscriptionId: subscriptionId || "",
          });
        }
        await stripe.invoices.update(invoice.id, {
          metadata: {
            ...(invoice.metadata || {}),
            [FULFILLED_KEY]: event.id,
          },
        });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        if (alreadyDone(subscription.metadata, REVOKED_KEY)) break;
        if (subscription.metadata?.zedx_replaced === "1") break;
        await fulfillCart({
          metadata: subscription.metadata,
          orderId: `${subscription.id}:revoke`,
          revoke: true,
        });
        await stripe.subscriptions.update(subscription.id, {
          metadata: {
            ...(subscription.metadata || {}),
            [REVOKED_KEY]: event.id,
          },
        });
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        if (subscription.status !== "unpaid") break;
        if (alreadyDone(subscription.metadata, REVOKED_KEY)) break;
        if (subscription.metadata?.zedx_replaced === "1") break;
        await fulfillCart({
          metadata: subscription.metadata,
          orderId: `${subscription.id}:revoke`,
          revoke: true,
        });
        await stripe.subscriptions.update(subscription.id, {
          metadata: {
            ...(subscription.metadata || {}),
            [REVOKED_KEY]: event.id,
          },
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook fulfill error:", err);
    return NextResponse.json({ error: "Fulfillment failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

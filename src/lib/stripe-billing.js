import { ignKey } from "@/lib/minecraft-username";

const MANAGEABLE_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
  "unpaid",
]);

function safeQueryValue(player) {
  return String(player || "").replace(/"/g, "");
}

export function stripeObjectId(value) {
  if (!value) return "";
  return typeof value === "string" ? value : String(value.id || "");
}

function customerBelongsToPayer(customer, player) {
  const key = ignKey(player);
  if (!key) return false;
  const payer = ignKey(customer.metadata?.payer);
  if (payer) return payer === key;
  if (customer.metadata?.gift === "1") return false;
  return ignKey(customer.metadata?.player) === key;
}

export async function findPayerCustomers(stripe, player) {
  const safe = safeQueryValue(player);
  if (!safe) return [];

  const [byPayer, byPlayer] = await Promise.all([
    stripe.customers.search({
      query: `metadata["payer"]:"${safe}"`,
      limit: 10,
    }),
    stripe.customers.search({
      query: `metadata["player"]:"${safe}"`,
      limit: 10,
    }),
  ]);

  const map = new Map();
  for (const customer of [...byPayer.data, ...byPlayer.data]) {
    if (customerBelongsToPayer(customer, player)) {
      map.set(customer.id, customer);
    }
  }
  return [...map.values()];
}

export async function customerHasManageableSubscription(stripe, customerId) {
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 20,
  });
  return subs.data.some((sub) => MANAGEABLE_STATUSES.has(sub.status));
}

export async function findManageablePayerCustomer(stripe, player) {
  const customers = await findPayerCustomers(stripe, player);
  for (const customer of customers) {
    if (await customerHasManageableSubscription(stripe, customer.id)) {
      return customer;
    }
  }
  return null;
}

const STORE_RANK_SLUGS = new Set(["vip", "mvp", "zedx", "zedxplus", "knight"]);

export function rankSlugFromProductId(id) {
  if (!id || !String(id).startsWith("rank-")) return null;
  const slug = String(id)
    .replace(/^rank-/, "")
    .replace(/-1mo$/, "")
    .replace(/-renew$/, "")
    .replace(/-remove$/, "");
  return STORE_RANK_SLUGS.has(slug) ? slug : null;
}

function subscriptionProductId(sub) {
  return sub?.metadata?.product || "";
}

/**
 * Cancel other store-rank subscriptions so this payer is not billed for two
 * ranks. Scoped to the Stripe customer on this checkout/invoice — never by
 * Minecraft IGN across customers (guest checkout must not cancel someone else).
 */
export async function cancelOtherRankSubscriptions(
  stripe,
  { customerId, keepProductId, keepSubscriptionId },
) {
  const cid = stripeObjectId(customerId);
  if (!cid || !rankSlugFromProductId(keepProductId)) return [];

  const cancelled = [];
  const listed = await stripe.subscriptions.list({
    customer: cid,
    status: "all",
    limit: 100,
  });

  for (const sub of listed.data) {
    if (!MANAGEABLE_STATUSES.has(sub.status)) continue;
    if (keepSubscriptionId && sub.id === keepSubscriptionId) continue;
    if (!rankSlugFromProductId(subscriptionProductId(sub))) continue;

    try {
      await stripe.subscriptions.update(sub.id, {
        metadata: {
          ...(sub.metadata || {}),
          zedx_replaced: "1",
          zedx_replaced_by: keepProductId || "",
        },
      });
      await stripe.subscriptions.cancel(sub.id);
      cancelled.push(sub.id);
    } catch (err) {
      console.error("could not cancel replaced rank subscription", sub.id, err.message);
    }
  }
  return cancelled;
}

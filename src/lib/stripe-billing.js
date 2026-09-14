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

#!/usr/bin/env node
/** List Tebex packages (names + IDs) for syncing monthly-ranks.js */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = { ...process.env, ...loadEnvLocal() };
const webstoreId = env.TEBEX_WEBSTORE_ID || env.TEBEX_PUBLIC_TOKEN;
const privateKey = env.TEBEX_PRIVATE_KEY || env.TEBEX_SECRET_KEY;

if (!webstoreId || !privateKey) {
  console.error("Missing TEBEX_PUBLIC_TOKEN / TEBEX_PRIVATE_KEY in .env.local");
  process.exit(1);
}

const auth = Buffer.from(`${webstoreId}:${privateKey}`).toString("base64");
const res = await fetch(
  `https://headless.tebex.io/api/accounts/${webstoreId}/packages`,
  { headers: { Accept: "application/json", Authorization: `Basic ${auth}` } },
);
const text = await res.text();
if (!res.ok) {
  console.error(`HTTP ${res.status}`, text.slice(0, 500));
  process.exit(1);
}

const data = JSON.parse(text);
const packages = data?.data ?? data?.packages ?? data;
const list = Array.isArray(packages) ? packages : [];

console.log("Tebex packages:\n");
for (const p of list.sort((a, b) => (a.name || "").localeCompare(b.name || ""))) {
  const price = p.total_price ?? p.base_price ?? p.price;
  console.log(
    `${String(p.id).padEnd(10)}  ${(p.name || "?").padEnd(28)}  £${price ?? "?"}`,
  );
}

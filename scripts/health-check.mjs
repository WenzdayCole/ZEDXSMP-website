#!/usr/bin/env node
/**
 * Quick project health check: lint + build + Tebex config smoke test.
 * Run: node scripts/health-check.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const log = (label, ok, detail = "") => {
  const mark = ok ? "OK" : "FAIL";
  console.log(`[${mark}] ${label}${detail ? ` — ${detail}` : ""}`);
};

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

function run(cmd) {
  return execSync(cmd, { cwd: root, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
}

let failed = 0;

try {
  run("npm run lint");
  log("ESLint", true);
} catch (e) {
  log("ESLint", false, (e.stderr || e.stdout || e.message).slice(0, 400));
  failed++;
}

try {
  run("npm run build");
  log("Next.js build", true);
} catch (e) {
  log("Next.js build", false, (e.stderr || e.stdout || e.message).slice(0, 400));
  failed++;
}

const env = { ...process.env, ...loadEnvLocal() };
const webstoreId = env.TEBEX_WEBSTORE_ID || env.TEBEX_PUBLIC_TOKEN;
const privateKey = env.TEBEX_PRIVATE_KEY || env.TEBEX_SECRET_KEY;

if (!webstoreId?.startsWith("12pbc-")) {
  log("TEBEX token prefix", false, "TEBEX_PUBLIC_TOKEN should start with 12pbc-");
  failed++;
} else {
  log("TEBEX token prefix", true);
}

if (!privateKey) {
  log("TEBEX_PRIVATE_KEY", false, "missing");
  failed++;
} else {
  log("TEBEX_PRIVATE_KEY", true, "set");
}

if (webstoreId && privateKey) {
  try {
    const auth = Buffer.from(`${webstoreId}:${privateKey}`).toString("base64");
    const res = await fetch(`https://headless.tebex.io/api/accounts/${webstoreId}`, {
      headers: { Accept: "application/json", Authorization: `Basic ${auth}` },
    });
    const text = await res.text();
    if (res.ok) {
      log("Tebex webstore API", true, `HTTP ${res.status}`);
    } else {
      log("Tebex webstore API", false, `HTTP ${res.status} ${text.slice(0, 120)}`);
      failed++;
    }

    const basketRes = await fetch(
      `https://headless.tebex.io/api/accounts/${webstoreId}/baskets`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          complete_url: "http://localhost:3000/ranks?checkout=success",
          cancel_url: "http://localhost:3000/ranks",
          complete_auto_redirect: true,
          ip_address: "127.0.0.1",
        }),
      },
    );
    const basketText = await basketRes.text();
    if (basketRes.ok && basketText.includes('"ident"')) {
      log("Tebex anonymous basket", true, `HTTP ${basketRes.status}`);
    } else {
      log("Tebex anonymous basket", false, `HTTP ${basketRes.status} ${basketText.slice(0, 120)}`);
      failed++;
    }
  } catch (e) {
    log("Tebex API network", false, e.message);
    failed++;
  }
}

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);

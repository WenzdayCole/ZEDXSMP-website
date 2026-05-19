#!/usr/bin/env node
/** Tebex-only smoke test. Full check: npm run health */
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const r = spawnSync(process.execPath, ["scripts/health-check.mjs"], {
  cwd: root,
  stdio: "inherit",
});
process.exit(r.status ?? 1);

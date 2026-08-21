import { isValidMinecraftUsernameFormat } from "@/lib/minecraft-username";

function authSecret() {
  return (process.env.ZEDX_AUTH_SECRET || "").trim();
}

function authVerifyUrl() {
  return (process.env.ZEDX_AUTH_URL || "").trim();
}

function authBaseUrl() {
  return authVerifyUrl().replace(/\/v1\/verify\/?$/i, "");
}

async function authFetch(path, body) {
  const secret = authSecret();
  const base = authBaseUrl();
  if (!secret || !base) {
    throw new Error("ZEDX_AUTH_URL or ZEDX_AUTH_SECRET is not set.");
  }

  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  return { res, data };
}

export async function pingAuthHealth() {
  const base = authBaseUrl();
  if (!base) return { ok: false, error: "ZEDX_AUTH_URL missing" };
  try {
    const res = await fetch(`${base}/v1/health`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.ok === true, plugin: data.plugin || null };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function pingStoreHealth() {
  const deliver = (process.env.ZEDX_STORE_URL || "").trim();
  const base = deliver.replace(/\/v1\/deliver\/?$/i, "");
  if (!base) return { ok: false, error: "ZEDX_STORE_URL missing" };
  try {
    const res = await fetch(`${base}/v1/health`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.ok === true, plugin: data.plugin || null };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function verifyPlayerPassword(player, password) {
  const name = String(player || "").trim();
  if (!isValidMinecraftUsernameFormat(name)) {
    return { ok: false, status: 400, error: "Invalid username." };
  }
  if (!password || String(password).length < 8) {
    return { ok: false, status: 400, error: "Password must be at least 8 characters." };
  }

  const { res, data } = await authFetch("/v1/verify", {
    player: name,
    password: String(password),
  });

  if (res.status === 401 || data.ok === false) {
    return {
      ok: false,
      status: 401,
      error: "Wrong password, or this username has not run /register in-game.",
    };
  }
  if (!res.ok || data.ok !== true) {
    return {
      ok: false,
      status: 502,
      error: "Could not reach ZedxWebAuth.",
    };
  }

  return {
    ok: true,
    uuid: data.uuid || null,
    player: data.player || name,
  };
}

export async function isPlayerRegistered(player) {
  const name = String(player || "").trim();
  const { res, data } = await authFetch("/v1/registered", { player: name });
  if (!res.ok) return false;
  return data.registered === true;
}

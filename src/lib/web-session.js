import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "zedx_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  return (
    process.env.ZEDX_AUTH_SECRET ||
    process.env.WEB_SESSION_SECRET ||
    ""
  );
}

function sign(payloadB64) {
  return createHmac("sha256", secret()).update(payloadB64).digest("base64url");
}

export function encodeSession(data) {
  const payload = Buffer.from(
    JSON.stringify({ ...data, exp: Date.now() + MAX_AGE * 1000 }),
    "utf8",
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token) {
  if (!token || !secret()) return null;
  const [payload, sig] = String(token).split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getSession() {
  const jar = await cookies();
  return decodeSession(jar.get(COOKIE)?.value);
}

export async function setSessionCookie(data) {
  const jar = await cookies();
  jar.set(COOKIE, encodeSession(data), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

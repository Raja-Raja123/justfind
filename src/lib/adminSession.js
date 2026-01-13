import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "apnabiz_admin_session";
const SESSION_LIFETIME_MS = 1000 * 60 * 60 * 12; // 12 hours
const DEFAULT_SECRET = "apnabiz-dev-secret";

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
}

function createSignature(payload) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
}

export function createSessionToken(userId, lifetimeMs = SESSION_LIFETIME_MS) {
  const expiresAt = Date.now() + lifetimeMs;
  const base = `${userId}|${expiresAt}`;
  const signature = createSignature(base);
  return `${base}|${signature}`;
}

export function parseSessionToken(token) {
  if (typeof token !== "string") {
    return null;
  }
  const parts = token.split("|");
  if (parts.length !== 3) {
    return null;
  }
  const [userId, expiresAtStr, signature] = parts;
  const base = `${userId}|${expiresAtStr}`;
  const expected = createSignature(base);
  if (signature !== expected) {
    return null;
  }
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return null;
  }
  return { userId, expiresAt };
}

export function setSessionCookie(response, token) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_LIFETIME_MS / 1000),
  });
}

export function clearSessionCookie(response) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionFromCookies(cookieStore) {
  if (!cookieStore || typeof cookieStore.get !== "function") {
    return null;
  }

  const storedCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
  const token =
    typeof storedCookie === "string" ? storedCookie : storedCookie?.value;
  return parseSessionToken(token ?? "");
}

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "poetry_admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function verifySession(value: string | undefined) {
  const secret = getSecret();
  if (!value || !secret) {
    return false;
  }

  const [payload, signature] = value.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  const isSigned = timingSafeEqual(expectedBuffer, signatureBuffer);
  const issuedAt = Number(Buffer.from(payload, "base64url").toString("utf8"));
  const maxAge = 60 * 60 * 24 * 7 * 1000;

  return isSigned && Number.isFinite(issuedAt) && Date.now() - issuedAt < maxAge;
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifySession(store.get(cookieName)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

export async function createAdminSession() {
  const store = await cookies();
  const payload = Buffer.from(String(Date.now()), "utf8").toString("base64url");
  store.set(cookieName, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(cookieName);
}

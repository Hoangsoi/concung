import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const name = "concung_session";
function sign(value: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Session configuration missing");
  return createHmac("sha256", secret).update(value).digest("hex");
}
export function attachSession(response: NextResponse, id: number) {
  const value = `${id}.${Date.now() + 7 * 86400000}`;
  response.cookies.set(name, `${value}.${sign(value)}`, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 86400 });
  return response;
}
export function sessionUserId(): number | null {
  const raw = cookies().get(name)?.value;
  if (!raw) return null;
  const [id, expires, signature, extra] = raw.split(".");
  if (extra || !/^\d+$/.test(id) || !/^\d+$/.test(expires) || !/^[a-f0-9]{64}$/.test(signature || "") || Number(expires) <= Date.now()) return null;
  const expected = sign(`${id}.${expires}`);
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) && Number.isSafeInteger(Number(id)) ? Number(id) : null;
}
export function clearSession(response: NextResponse) {
  response.cookies.set(name, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}

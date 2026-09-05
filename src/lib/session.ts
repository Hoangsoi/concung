import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const name = "concung_session";
const DEFAULT_SECRET = "concung_default_secret_key_2026_safe_fallback";

function sign(value: string) {
  const secret = process.env.SESSION_SECRET || DEFAULT_SECRET;
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function attachSession(response: NextResponse, id: number) {
  try {
    const value = `${id}.${Date.now() + 7 * 86400000}`;
    const signature = sign(value);
    response.cookies.set(name, `${value}.${signature}`, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 86400,
    });
  } catch (err) {
    console.error("Error setting session cookie:", err);
  }
  return response;
}

export function sessionUserId(): number | null {
  try {
    const raw = cookies().get(name)?.value;
    if (!raw) return null;
    const parts = raw.split(".");
    if (parts.length !== 3) return null;
    const [id, expires, signature] = parts;
    if (!/^\d+$/.test(id) || !/^\d+$/.test(expires) || !/^[a-f0-9]{64}$/.test(signature || "") || Number(expires) <= Date.now()) return null;
    const expected = sign(`${id}.${expires}`);
    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expected);
    if (sigBuffer.length !== expBuffer.length) return null;
    return timingSafeEqual(sigBuffer, expBuffer) && Number.isSafeInteger(Number(id)) ? Number(id) : null;
  } catch {
    return null;
  }
}

export function clearSession(response: NextResponse) {
  try {
    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  } catch (err) {
    console.error("Error clearing session cookie:", err);
  }
  return response;
}

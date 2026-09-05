import { NextResponse } from "next/server";
import { sessionUserId } from "@/lib/session";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const id = sessionUserId();
    if (!id) return NextResponse.json({ error: "Vui lòng đăng nhập lại." }, { status: 401 });
    const rows = await sql`SELECT id, full_name, phone, created_at FROM users WHERE id = ${id} LIMIT 1`;
    if (!rows[0]) return NextResponse.json({ error: "Tài khoản không còn tồn tại." }, { status: 401 });
    const user = rows[0];
    return NextResponse.json({ user: { fullName: user.full_name, phone: user.phone, createdAt: user.created_at } }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Chưa tải được thông tin tài khoản. Vui lòng thử lại." }, { status: 503 });
  }
}

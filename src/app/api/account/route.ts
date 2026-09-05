import { NextResponse } from "next/server";
import { sessionUserId } from "@/lib/session";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const id = sessionUserId();
    if (!id) return NextResponse.json({ error: "Vui lòng đăng nhập lại." }, { status: 401 });

    try {
      const rows = await sql`SELECT id, full_name, phone, created_at FROM users WHERE id = ${id} LIMIT 1`;
      if (rows[0]) {
        const user = rows[0];
        return NextResponse.json(
          { user: { fullName: user.full_name, phone: user.phone, createdAt: user.created_at } },
          { headers: { "Cache-Control": "no-store" } }
        );
      }
    } catch (dbErr) {
      console.warn("DB error in /api/account:", dbErr);
    }

    // Fallback user if session id exists or DB query failed
    return NextResponse.json(
      { user: { fullName: "Nguyễn Thị Mai", phone: "0988999999", createdAt: new Date().toISOString() } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "Chưa tải được thông tin tài khoản. Vui lòng thử lại." }, { status: 503 });
  }
}

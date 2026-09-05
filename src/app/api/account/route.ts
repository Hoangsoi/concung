import { NextResponse } from "next/server";
import { sessionUserId } from "@/lib/session";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const id = sessionUserId();
    if (!id) {
      return NextResponse.json({ error: "Vui lòng đăng nhập lại." }, { status: 401 });
    }

    try {
      const rows = await sql`SELECT id, full_name, phone, COALESCE(balance, 0) as balance, created_at FROM users WHERE id = ${id} LIMIT 1`;
      if (rows.length > 0) {
        const user = rows[0];
        return NextResponse.json(
          {
            user: {
              id: user.id,
              fullName: user.full_name,
              phone: user.phone,
              balance: Number(user.balance || 0),
              createdAt: user.created_at,
            },
          },
          { headers: { "Cache-Control": "no-store" } }
        );
      }
    } catch (dbErr) {
      console.warn("DB error in /api/account:", dbErr);
    }

    return NextResponse.json({ error: "Không tìm thấy thông tin tài khoản." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Chưa tải được thông tin tài khoản. Vui lòng thử lại." }, { status: 503 });
  }
}

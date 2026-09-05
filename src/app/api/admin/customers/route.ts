import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function verifyAdminAuth() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    return session?.value === "true";
  } catch {
    return false;
  }
}

async function ensureUserStatusColumn() {
  try {
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
    `;
  } catch (err) {
    // Column might already exist
  }
}

export async function GET() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "Không có quyền truy cập trang Quản trị" }, { status: 401 });
  }

  try {
    await ensureUserStatusColumn();

    // 1. Fetch registered users from Neon PostgreSQL
    let users: any[] = [];
    try {
      users = await sql`
        SELECT 
          u.id, 
          u.full_name as "fullName", 
          u.phone, 
          COALESCE(u.status, 'active') as "status",
          u.created_at as "createdAt",
          b.bank_name as "bankName",
          b.account_number as "accountNumber",
          b.account_holder as "accountHolder"
        FROM users u
        LEFT JOIN bank_accounts b ON u.id = b.user_id
        ORDER BY u.id DESC;
      `;
    } catch (err) {
      console.warn("Error fetching users from Neon:", err);
    }

    return NextResponse.json({ customers: users });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải danh sách khách hàng" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "Không có quyền truy cập trang Quản trị" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, customerId, status, fullName, phone, bankName, accountNumber, accountHolder } = body;

    if (!customerId) {
      return NextResponse.json({ error: "Thiếu ID khách hàng" }, { status: 400 });
    }

    await ensureUserStatusColumn();

    // Prevent modifying admin account
    try {
      const targetUser = await sql`SELECT phone FROM users WHERE id = ${customerId} LIMIT 1;`;
      if (targetUser.length > 0 && (targetUser[0].phone === "admin" || targetUser[0].phone?.toLowerCase().includes("admin"))) {
        return NextResponse.json({ error: "Không thể chỉnh sửa hoặc khóa tài khoản Admin!" }, { status: 400 });
      }
    } catch {
      // ignore
    }

    if (action === "updateStatus" && status) {
      try {
        await sql`
          UPDATE users 
          SET status = ${status} 
          WHERE id = ${customerId};
        `;
      } catch (err) {
        console.warn("Error updating user status in Neon:", err);
      }

      return NextResponse.json({
        success: true,
        message: `Đã cập nhật trạng thái tài khoản #${customerId} thành ${
          status === "frozen" ? "ĐÓNG BĂNG" : status === "locked" ? "BỊ KHÓA" : "BÌNH THƯỜNG"
        }!`,
      });
    }

    if (action === "updateInfo") {
      try {
        if (fullName || phone) {
          await sql`
            UPDATE users 
            SET full_name = COALESCE(${fullName}, full_name),
                phone = COALESCE(${phone}, phone)
            WHERE id = ${customerId};
          `;
        }

        if (bankName && accountNumber && accountHolder) {
          await sql`
            INSERT INTO bank_accounts (user_id, bank_name, account_number, account_holder)
            VALUES (${customerId}, ${bankName.trim()}, ${accountNumber.trim()}, ${accountHolder.trim().toUpperCase()})
            ON CONFLICT (user_id) 
            DO UPDATE SET 
              bank_name = EXCLUDED.bank_name,
              account_number = EXCLUDED.account_number,
              account_holder = EXCLUDED.account_holder,
              updated_at = CURRENT_TIMESTAMP;
          `;
        }
      } catch (err) {
        console.warn("Error updating customer info in Neon:", err);
      }

      return NextResponse.json({
        success: true,
        message: `Đã cập nhật thông tin khách hàng #${customerId} thành công!`,
      });
    }

    return NextResponse.json({ error: "Hành động không hợp lệ" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi cập nhật thông tin khách hàng" }, { status: 500 });
  }
}

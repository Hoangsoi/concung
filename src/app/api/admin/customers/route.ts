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

export async function GET() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "Không có quyền truy cập trang Quản trị" }, { status: 401 });
  }

  try {
    // 1. Fetch registered users from Neon PostgreSQL
    let users: any[] = [];
    try {
      users = await sql`
        SELECT 
          u.id, 
          u.full_name as "fullName", 
          u.phone, 
          u.created_at as "createdAt",
          b.bank_name as "bankName",
          b.account_number as "accountNumber",
          b.account_holder as "accountHolder"
        FROM users u
        LEFT JOIN bank_accounts b ON u.id = b.user_id
        ORDER BY u.id DESC;
      `;
    } catch (err) {
      console.warn("Error fetching users from Neon, using default table check:", err);
    }

    if (users.length === 0) {
      // Demo mock data if database has no registered users yet
      users = [
        {
          id: 1,
          fullName: "Nguyễn Thị Mai",
          phone: "0988999999",
          createdAt: new Date().toISOString(),
          bankName: "Vietcombank",
          accountNumber: "9988112233",
          accountHolder: "NGUYEN THI MAI",
          balance: 15000000,
        },
        {
          id: 2,
          fullName: "Trần Thị Tuyết",
          phone: "0901234567",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          bankName: "MBBank",
          accountNumber: "0333888999",
          accountHolder: "TRAN THI TUYET",
          balance: 5200000,
        },
        {
          id: 3,
          fullName: "Lê Hoàng Nam",
          phone: "0912345678",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          bankName: "Techcombank",
          accountNumber: "190388445566",
          accountHolder: "LE HOANG NAM",
          balance: 0,
        },
      ];
    }

    return NextResponse.json({ customers: users });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải danh sách khách hàng" }, { status: 500 });
  }
}

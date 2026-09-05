import { attachSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, password } = body;

    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại và Mật khẩu" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const plainPassword = password.trim();

    // Check if phone already registered
    const existingUsers = await sql`
      SELECT id FROM users WHERE phone = ${cleanPhone} LIMIT 1;
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Số điện thoại này đã được đăng ký tài khoản. Ba mẹ vui lòng chọn Đăng Nhập." },
        { status: 400 }
      );
    }

    // Insert user into Neon PostgreSQL users table with plain text password
    const result = await sql`
      INSERT INTO users (full_name, phone, password)
      VALUES (${fullName.trim()}, ${cleanPhone}, ${plainPassword})
      RETURNING id, full_name, phone, created_at;
    `;

    const newUser = result[0];

    return attachSession(NextResponse.json({
      success: true,
      message: "Đăng ký tài khoản thành công!",
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        phone: newUser.phone,
      },
    }), newUser.id);
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

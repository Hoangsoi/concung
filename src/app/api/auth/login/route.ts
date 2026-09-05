import { attachSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ Số điện thoại và Mật khẩu" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const inputPassword = password.trim();

    // Query user by phone
    const users = await sql`
      SELECT id, full_name, phone, password FROM users WHERE phone = ${cleanPhone} LIMIT 1;
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Số điện thoại hoặc mật khẩu không chính xác. Ba mẹ vui lòng kiểm tra lại." },
        { status: 400 }
      );
    }

    const user = users[0];

    // Verify plain text password
    if (user.password !== inputPassword) {
      return NextResponse.json(
        { error: "Số điện thoại hoặc mật khẩu không chính xác. Ba mẹ vui lòng kiểm tra lại." },
        { status: 400 }
      );
    }

    return attachSession(NextResponse.json({
      success: true,
      message: "Đăng nhập thành công!",
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
      },
    }), user.id);
  } catch (error: any) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { error: "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

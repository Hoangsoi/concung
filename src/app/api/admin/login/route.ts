import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập tài khoản và mật khẩu admin" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();
    const inputPassword = password.trim();

    try {
      // 1. Ensure users table has admin user so it appears in Neon Console 'users' table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await sql`
        INSERT INTO users (full_name, phone, password)
        VALUES ('Quản Trị Viên Admin', 'admin', 'admin123@')
        ON CONFLICT (phone) 
        DO UPDATE SET password = 'admin123@', full_name = 'Quản Trị Viên Admin';
      `;

      // 2. Ensure admins table exists in Neon PostgreSQL
      await sql`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await sql`
        INSERT INTO admins (username, password)
        VALUES ('admin', 'admin123@')
        ON CONFLICT (username) 
        DO UPDATE SET password = 'admin123@';
      `;

      // 3. Query admin credentials from Neon (checking users table or admins table)
      const rows = await sql`
        SELECT phone as username, password FROM users WHERE phone = ${cleanUsername} LIMIT 1;
      `;

      if (rows.length > 0) {
        const admin = rows[0];
        if (admin.password !== inputPassword) {
          return NextResponse.json(
            { error: "Mật khẩu admin không chính xác." },
            { status: 400 }
          );
        }

        // Set admin session cookie
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        });

        return NextResponse.json({
          success: true,
          message: "Đăng nhập Cổng Quản Trị thành công!",
          admin: { username: admin.username },
        });
      }
    } catch (dbErr) {
      console.warn("Neon DB warning during admin login, checking fallback credentials:", dbErr);
    }

    // Fallback credential check
    if (cleanUsername === "admin" && inputPassword === "admin123@") {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return NextResponse.json({
        success: true,
        message: "Đăng nhập Cổng Quản Trị thành công!",
        admin: { username: "admin" },
      });
    }

    return NextResponse.json(
      { error: "Tài khoản hoặc mật khẩu admin không chính xác." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error in admin login:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi xử lý đăng nhập." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    return NextResponse.json({ authenticated: session?.value === "true" });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

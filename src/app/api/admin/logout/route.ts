import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return NextResponse.json({ success: true, message: "Đã đăng xuất Cổng Quản Trị" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi đăng xuất" }, { status: 500 });
  }
}

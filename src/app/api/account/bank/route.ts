import { NextResponse } from "next/server";
import { sessionUserId } from "@/lib/session";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

// Ensure bank_accounts table exists in Neon PostgreSQL
async function ensureBankTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      bank_name VARCHAR(255) NOT NULL,
      account_number VARCHAR(100) NOT NULL,
      account_holder VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function GET() {
  try {
    const userId = sessionUserId();
    if (!userId) {
      return NextResponse.json({ bank: null, error: "Chưa đăng nhập" }, { status: 401 });
    }

    try {
      await ensureBankTable();

      const rows = await sql`
        SELECT bank_name, account_number, account_holder, created_at 
        FROM bank_accounts 
        WHERE user_id = ${userId} 
        LIMIT 1;
      `;

      if (rows.length > 0) {
        const row = rows[0];
        return NextResponse.json({
          bank: {
            bankName: row.bank_name,
            accountNumber: row.account_number,
            accountHolder: row.account_holder,
            linkedAt: row.created_at
              ? new Date(row.created_at).toLocaleDateString("vi-VN")
              : undefined,
          },
        });
      }
    } catch (dbErr) {
      console.warn("Neon DB error reading bank account:", dbErr);
    }

    return NextResponse.json({ bank: null });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tải thông tin ngân hàng." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = sessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để thực hiện" }, { status: 401 });
    }

    const body = await request.json();
    const { bankName, accountNumber, accountHolder } = body;

    if (!bankName || !accountNumber || !accountHolder) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ Tên ngân hàng, Số tài khoản và Tên chủ tài khoản." },
        { status: 400 }
      );
    }

    try {
      await ensureBankTable();

      const rows = await sql`
        INSERT INTO bank_accounts (user_id, bank_name, account_number, account_holder)
        VALUES (${userId}, ${bankName.trim()}, ${accountNumber.trim()}, ${accountHolder.trim().toUpperCase()})
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          bank_name = EXCLUDED.bank_name,
          account_number = EXCLUDED.account_number,
          account_holder = EXCLUDED.account_holder,
          updated_at = CURRENT_TIMESTAMP
        RETURNING bank_name, account_number, account_holder, created_at;
      `;

      if (rows.length > 0) {
        const row = rows[0];
        return NextResponse.json({
          success: true,
          bank: {
            bankName: row.bank_name,
            accountNumber: row.account_number,
            accountHolder: row.account_holder,
            linkedAt: new Date(row.created_at).toLocaleDateString("vi-VN"),
          },
        });
      }
    } catch (dbErr) {
      console.warn("Neon DB error saving bank account:", dbErr);
    }

    return NextResponse.json(
      { error: "Không thể lưu thông tin ngân hàng. Vui lòng thử lại sau." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error saving bank account:", error);
    return NextResponse.json(
      { error: "Không thể lưu tài khoản ngân hàng. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

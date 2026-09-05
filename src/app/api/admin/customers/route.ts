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

async function ensureUserColumns() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        balance NUMERIC(15,2) DEFAULT 0,
        tier VARCHAR(50) DEFAULT 'Thành Viên',
        credit_score INT DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS balance NUMERIC(15,2) DEFAULT 0;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT 'Thành Viên';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS credit_score INT DEFAULT 100;`;

    await sql`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        bank_name VARCHAR(255) NOT NULL,
        account_number VARCHAR(100) NOT NULL,
        account_holder VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (err) {
    console.warn("ensureUserColumns warning:", err);
  }
}

export async function GET() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: "Không có quyền truy cập trang Quản trị" }, { status: 401 });
  }

  try {
    await ensureUserColumns();

    // 1. Fetch registered users from Neon PostgreSQL
    let users: any[] = [];
    try {
      users = await sql`
        SELECT 
          u.id, 
          u.full_name as "fullName", 
          u.phone, 
          u.password,
          COALESCE(u.balance, 0) as "balance",
          COALESCE(u.tier, 'Thành Viên') as "tier",
          COALESCE(u.credit_score, 100) as "creditScore",
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
    const { action, customerId, status, fullName, phone, password, bankName, accountNumber, accountHolder, amount, note, tier, creditScore } = body;

    if (!customerId) {
      return NextResponse.json({ error: "Thiếu ID khách hàng" }, { status: 400 });
    }

    await ensureUserColumns();

    // Prevent modifying admin account
    try {
      const targetUser = await sql`SELECT phone FROM users WHERE id = ${customerId} LIMIT 1;`;
      if (targetUser.length > 0 && (targetUser[0].phone === "admin" || targetUser[0].phone?.toLowerCase().includes("admin"))) {
        return NextResponse.json({ error: "Không thể thao tác trên tài khoản Admin!" }, { status: 400 });
      }
    } catch {
      // ignore
    }

    if (action === "addMoney") {
      const addAmount = Number(amount);
      if (isNaN(addAmount) || addAmount <= 0) {
        return NextResponse.json({ error: "Số tiền cộng phải lớn hơn 0" }, { status: 400 });
      }

      const noteStr = note ? String(note).trim() : "";
      const finalNote = noteStr || "Nạp tiền";

      try {
        // 1. Fetch user info
        const userRes = await sql`SELECT full_name, phone FROM users WHERE id = ${customerId} LIMIT 1;`;
        if (userRes.length === 0) {
          return NextResponse.json({ error: "Không tìm thấy thông tin khách hàng" }, { status: 404 });
        }
        const userObj = userRes[0];

        // 2. Update user balance
        await sql`
          UPDATE users 
          SET balance = COALESCE(balance, 0) + ${addAmount}
          WHERE id = ${customerId};
        `;

        // 3. Fetch user bank account info if available
        const bankRes = await sql`
          SELECT bank_name, account_number, account_holder 
          FROM bank_accounts 
          WHERE user_id = ${customerId} 
          LIMIT 1;
        `;
        const bankObj = bankRes.length > 0 ? bankRes[0] : null;

        // 4. Insert transaction into wallet_transactions
        await sql`
          CREATE TABLE IF NOT EXISTS wallet_transactions (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            user_name VARCHAR(255),
            user_phone VARCHAR(50),
            type VARCHAR(20) NOT NULL,
            amount NUMERIC(15,2) NOT NULL,
            bank_name VARCHAR(255),
            account_number VARCHAR(100),
            account_holder VARCHAR(255),
            status VARCHAR(20) DEFAULT 'pending',
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;

        await sql`
          INSERT INTO wallet_transactions (user_id, user_name, user_phone, type, amount, bank_name, account_number, account_holder, status, note, created_at)
          VALUES (
            ${customerId}, 
            ${userObj.full_name}, 
            ${userObj.phone}, 
            'deposit', 
            ${addAmount}, 
            ${bankObj ? bankObj.bank_name : null}, 
            ${bankObj ? bankObj.account_number : null}, 
            ${bankObj ? bankObj.account_holder : null}, 
            'approved', 
            ${finalNote},
            ${new Date().toISOString()}
          );
        `;

        return NextResponse.json({
          success: true,
          message: `Đã cộng thành công ${addAmount.toLocaleString("vi-VN")}đ cho khách hàng ${userObj.full_name} (${finalNote})!`,
        });
      } catch (err) {
        console.error("Error adding money in Neon:", err);
        return NextResponse.json({ error: "Lỗi cộng tiền cho khách hàng" }, { status: 500 });
      }
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
        const scoreVal = creditScore !== undefined && creditScore !== "" ? Number(creditScore) : null;
        await sql`
          UPDATE users 
          SET full_name = COALESCE(${fullName}, full_name),
              phone = COALESCE(${phone}, phone),
              password = COALESCE(${password}, password),
              tier = COALESCE(${tier}, tier),
              credit_score = COALESCE(${scoreVal}, credit_score)
          WHERE id = ${customerId};
        `;

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

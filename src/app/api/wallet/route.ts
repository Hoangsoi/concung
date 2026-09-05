import { NextResponse } from "next/server";
import { sessionUserId } from "@/lib/session";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = sessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // 1. Fetch user balance & status from Neon
    let balance = 0;
    let status = "active";
    try {
      const userRows = await sql`
        SELECT COALESCE(balance, 0) as balance, COALESCE(status, 'active') as status
        FROM users 
        WHERE id = ${userId} 
        LIMIT 1;
      `;
      if (userRows.length > 0) {
        balance = Number(userRows[0].balance || 0);
        status = userRows[0].status || "active";
      }
    } catch (err) {
      console.warn("Error fetching user balance in /api/wallet:", err);
    }

    // 2. Fetch stats and transaction list from wallet_transactions table
    let totalDeposit = 0;
    let totalWithdraw = 0;
    let pendingDeposit = 0;
    let txCount = 0;
    let transactions: any[] = [];

    try {
      const [stats, txList] = await Promise.all([
        sql`
          SELECT 
            COALESCE(SUM(CASE WHEN type = 'deposit' AND status = 'approved' THEN amount ELSE 0 END), 0) as "totalDeposit",
            COALESCE(SUM(CASE WHEN type = 'withdraw' AND status = 'approved' THEN amount ELSE 0 END), 0) as "totalWithdraw",
            COALESCE(SUM(CASE WHEN type = 'deposit' AND status = 'pending' THEN amount ELSE 0 END), 0) as "pendingDeposit",
            COUNT(*) as "txCount"
          FROM wallet_transactions
          WHERE user_id = ${userId};
        `,
        sql`
          SELECT 
            id,
            user_id as "userId",
            type,
            amount,
            status,
            note,
            bank_name as "bankName",
            account_number as "accountNumber",
            account_holder as "accountHolder",
            created_at as "createdAt"
          FROM wallet_transactions
          WHERE user_id = ${userId}
          ORDER BY id DESC;
        `,
      ]);

      if (stats.length > 0) {
        totalDeposit = Number(stats[0].totalDeposit || 0);
        totalWithdraw = Number(stats[0].totalWithdraw || 0);
        pendingDeposit = Number(stats[0].pendingDeposit || 0);
        txCount = Number(stats[0].txCount || 0);
      }
      transactions = txList || [];
    } catch (err) {
      console.warn("Error fetching wallet stats in /api/wallet:", err);
    }

    return NextResponse.json(
      {
        balance,
        status,
        totalDeposit,
        totalWithdraw,
        pendingDeposit,
        txCount,
        transactions,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json({ error: "Lỗi hệ thống khi tải ví" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = sessionUserId();
    if (!userId) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để thực hiện giao dịch." }, { status: 401 });
    }

    const body = await request.json();
    const { action, amount } = body;

    if (action === "withdraw") {
      const withdrawAmount = Number(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        return NextResponse.json({ error: "Số tiền rút phải lớn hơn 0" }, { status: 400 });
      }

      // Check current user balance, status & details
      const users = await sql`
        SELECT full_name, phone, COALESCE(balance, 0) as balance, COALESCE(status, 'active') as status 
        FROM users 
        WHERE id = ${userId} 
        LIMIT 1;
      `;
      if (users.length === 0) {
        return NextResponse.json({ error: "Không tìm thấy thông tin tài khoản." }, { status: 404 });
      }

      const user = users[0];

      if (user.status === "frozen") {
        return NextResponse.json(
          { error: "Tài khoản của bạn đang bị đóng băng. Không thể thực hiện lệnh rút tiền. Vui lòng liên hệ Admin để được hỗ trợ." },
          { status: 403 }
        );
      }

      if (user.status === "locked") {
        return NextResponse.json(
          { error: "Tài khoản của bạn đã bị khóa. Không thể thực hiện giao dịch." },
          { status: 403 }
        );
      }

      const currentBalance = Number(user.balance || 0);
      if (withdrawAmount > currentBalance) {
        return NextResponse.json({ error: "Số dư trong ví không đủ để rút tiền." }, { status: 400 });
      }

      // Check linked bank account
      const bankRows = await sql`
        SELECT bank_name, account_number, account_holder 
        FROM bank_accounts 
        WHERE user_id = ${userId} 
        LIMIT 1;
      `;
      if (bankRows.length === 0) {
        return NextResponse.json({ error: "Vui lòng liên kết tài khoản ngân hàng trước khi rút tiền." }, { status: 400 });
      }

      const bank = bankRows[0];

      // Deduct balance from user
      const newBalance = currentBalance - withdrawAmount;
      await sql`
        UPDATE users 
        SET balance = ${newBalance} 
        WHERE id = ${userId};
      `;

      // Insert transaction into wallet_transactions
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
        INSERT INTO wallet_transactions (user_id, user_name, user_phone, type, amount, bank_name, account_number, account_holder, status, note)
        VALUES (
          ${userId}, 
          ${user.full_name}, 
          ${user.phone}, 
          'withdraw', 
          ${withdrawAmount}, 
          ${bank.bank_name}, 
          ${bank.account_number}, 
          ${bank.account_holder}, 
          'pending', 
          'Rút tiền về tài khoản ngân hàng'
        );
      `;

      return NextResponse.json({
        success: true,
        message: "Tạo yêu cầu rút tiền thành công!",
        remainingBalance: newBalance,
      });
    }

    return NextResponse.json({ error: "Hành động không hợp lệ" }, { status: 400 });
  } catch (err) {
    console.error("Error processing withdraw request:", err);
    return NextResponse.json({ error: "Có lỗi xảy ra khi tạo yêu cầu rút tiền." }, { status: 500 });
  }
}

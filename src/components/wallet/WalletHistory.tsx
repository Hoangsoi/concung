"use client";

import { useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import styles from "@/app/(main)/wallet/wallet.module.css";

export function WalletHistory() {
  const [filter, setFilter] = useState("all");
  return <section className={styles.panel} aria-label="Lịch sử nạp rút">
    <div className={styles.historyTitle}><h2 className="font-bold mb-5">Lịch sử nạp/rút</h2><History size={21} /></div>
    <div className={styles.filters}>{[{ id: "all", label: "Tất cả" }, { id: "deposit", label: "Nạp tiền" }, { id: "withdraw", label: "Rút tiền" }].map(item => <button key={item.id} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div>
    <div className={styles.empty} role="status"><span><History size={30} /></span><strong>Chưa thể tải lịch sử{filter === "deposit" ? " nạp tiền" : filter === "withdraw" ? " rút tiền" : " giao dịch"}</strong><p>Dịch vụ thanh toán chưa được kết nối. Lịch sử sẽ hiển thị khi dịch vụ sẵn sàng.</p></div>
    <Link href="/wallet" className={styles.back}>Về Ví của ba mẹ</Link>
  </section>;
}

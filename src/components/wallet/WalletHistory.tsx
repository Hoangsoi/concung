"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ArrowDownToLine, ArrowUpFromLine, RefreshCcw } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { formatVNDateTime } from "@/lib/dateUtils";
import styles from "@/app/(main)/wallet/wallet.module.css";

interface Transaction {
  id: number;
  userId: number;
  type: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "approved" | "rejected";
  note?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  createdAt: string;
}

export function WalletHistory() {
  const [filter, setFilter] = useState<"all" | "deposit" | "withdraw">("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/wallet", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.warn("Failed to load customer wallet history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchHistory();

    // 3-second background polling for live real-time history sync
    const intervalId = setInterval(() => {
      void fetchHistory();
    }, 3000);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("concung_realtime");
      channel.onmessage = (event) => {
        if (event.data?.type === "REFRESH_WALLET") {
          void fetchHistory();
        }
      };
    } catch {
      // Fallback
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "wallet_updated") {
        void fetchHistory();
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageEvent);
      if (channel) channel.close();
    };
  }, []);

  const filteredTxs = transactions.filter(
    (t) => filter === "all" || t.type === filter
  );

  return (
    <section className={styles.panel} aria-label="Lịch sử nạp rút">
      <div className={styles.historyTitle}>
        <h2 className="font-bold mb-5 flex items-center gap-2 text-slate-800">
          <span>Lịch sử nạp/rút</span>
          {loading && <RefreshCcw size={16} className="animate-spin text-[#f52885]" />}
        </h2>
        <History size={21} className="text-[#f52885]" />
      </div>

      <div className={styles.filters}>
        {[
          { id: "all", label: "Tất cả" },
          { id: "deposit", label: "Nạp tiền" },
          { id: "withdraw", label: "Rút tiền" },
        ].map((item) => (
          <button
            key={item.id}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id as "all" | "deposit" | "withdraw")}
            className="cursor-pointer transition-all"
          >
            {item.label}
          </button>
        ))}
      </div>

      {filteredTxs.length === 0 ? (
        <div className={styles.empty} role="status">
          <span>
            <History size={30} />
          </span>
          <strong>
            {filter === "deposit"
              ? "Chưa có lịch sử nạp tiền"
              : filter === "withdraw"
              ? "Chưa có lịch sử rút tiền"
              : "Chưa có lịch sử giao dịch nào"}
          </strong>
          <p>Lịch sử nạp/rút tiền của bạn sẽ xuất hiện ở đây sau khi thực hiện giao dịch.</p>
        </div>
      ) : (
        <ul className={styles.transactions}>
          {filteredTxs.map((tx) => (
            <li key={tx.id} className="flex items-center gap-3 py-3.5 px-2 hover:bg-slate-50/60 transition-colors rounded-xl border-b border-slate-100/80 last:border-0">
              <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center ${
                tx.type === "deposit"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-rose-50 text-rose-500 border border-rose-100"
              }`}>
                {tx.type === "deposit" ? (
                  <ArrowDownToLine size={20} />
                ) : (
                  <ArrowUpFromLine size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 text-sm truncate">
                  {tx.type === "withdraw" ? "Rút tiền" : (tx.note || "Nạp tiền")}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="whitespace-nowrap">{formatVNDateTime(tx.createdAt)}</span>
                  <span>•</span>
                  {tx.status === "approved" && (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Đã duyệt
                    </span>
                  )}
                  {tx.status === "rejected" && (
                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      Từ chối
                    </span>
                  )}
                  {tx.status === "pending" && (
                    <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Chờ duyệt
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <b className={`font-mono text-base font-extrabold ${tx.type === "deposit" ? "text-emerald-600" : "text-slate-800"}`}>
                  {tx.type === "deposit" ? "+" : "-"}{formatVND(Number(tx.amount))}
                </b>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pt-4 border-t border-slate-100 mt-6 text-center">
        <Link href="/wallet" className={styles.back}>
          ← Về Ví của ba mẹ
        </Link>
      </div>
    </section>
  );
}

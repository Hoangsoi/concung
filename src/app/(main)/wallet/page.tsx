"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, RefreshCcw, Activity, X, Wallet, ChevronRight, CheckCircle2, Landmark } from "lucide-react";
import { formatVND } from "@/lib/utils";
import type { LinkedBank } from "../account/page";
import styles from "./wallet.module.css";
import dashboard from "./dashboard.module.css";

type Kind = "deposit" | "withdraw";
export default function WalletPage() {
  const [mode, setMode] = useState<Kind>("deposit");
  const [amount, setAmount] = useState("");
  const [linkedBank, setLinkedBank] = useState<LinkedBank | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const loadLinkedBank = () => {
    try {
      const saved = localStorage.getItem("concung_bank_account");
      if (saved) {
        setLinkedBank(JSON.parse(saved));
      } else {
        setLinkedBank(null);
      }
    } catch {
      setLinkedBank(null);
    }
  };

  useEffect(() => {
    loadLinkedBank();
    window.addEventListener("bank-account-changed", loadLinkedBank);
    window.addEventListener("storage", loadLinkedBank);
    return () => {
      window.removeEventListener("bank-account-changed", loadLinkedBank);
      window.removeEventListener("storage", loadLinkedBank);
    };
  }, []);

  function choose(kind: Kind) { setMode(kind); setAmount(""); dialog.current?.showModal(); }

  return <div className={dashboard.page}>
    <div className={dashboard.container}>
      <h1>Ví của tôi</h1>
      <section className={dashboard.balanceCard} aria-label="Số dư ví">
        <p>Số dư ví</p>
        <strong aria-label="Chưa có dữ liệu số dư">— <span>đ</span></strong>
        <div className={dashboard.actions}>
          <button type="button" disabled><ArrowDownToLine size={20} />Nạp tiền</button>
          <button onClick={() => choose("withdraw")}><ArrowUpFromLine size={20} />Rút tiền</button>
        </div>
      </section>
      <section aria-labelledby="wallet-stats-title">
        <h2 id="wallet-stats-title">Thống kê ví</h2>
        <div className={dashboard.stats}>
          {[
            { label: "TỔNG NẠP", icon: ArrowDownToLine, color: "green", money: true },
            { label: "TỔNG RÚT", icon: ArrowUpFromLine, color: "red", money: true },
            { label: "CHỜ NẠP", icon: RefreshCcw, color: "brown", money: true },
            { label: "GIAO DỊCH", icon: Activity, color: "pink", money: false },
          ].map(stat => <div key={stat.label} className={dashboard.stat}>
            <span className={`${dashboard.icon} ${dashboard[stat.color]}`}><stat.icon size={20} strokeWidth={1.7} /></span>
            <p>{stat.label}</p><strong aria-label="Chưa có dữ liệu">—{stat.money ? " đ" : ""}</strong>
          </div>)}
        </div>
        <p className={dashboard.notice}>Chưa có dữ liệu ví. Dịch vụ thanh toán đang chờ kết nối.</p>
      </section>
      <dialog ref={dialog} className={dashboard.dialog} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} aria-label={mode === "deposit" ? "Nạp tiền" : "Rút tiền"}>
        <section className={styles.panel}>
          <button autoFocus className={dashboard.close} onClick={() => dialog.current?.close()} aria-label="Đóng"><X size={22} /></button>
          <h3>{mode === "deposit" ? "Thêm vào ví, thêm tiện lợi" : "Rút tiền từ ví"}</h3>
          <form onSubmit={e => e.preventDefault()}>
            <label htmlFor="wallet-amount">Số tiền {mode === "deposit" ? "nạp" : "rút"}</label>
            <div className={styles.amountInput}><input id="wallet-amount" inputMode="numeric" autoComplete="off" placeholder="Nhập số tiền" value={amount} onChange={e => { setAmount(e.target.value.replace(/[^0-9]/g, ""));  }} aria-describedby="amount-hint payment-status" /><span>đ</span></div>
            <small id="amount-hint">Từ 10.000đ đến 10.000.000đ / giao dịch</small>
            <div className={styles.presets}>{[50000, 100000, 200000, 500000].map(value => <button type="button" key={value} aria-pressed={Number(amount) === value} onClick={() => { setAmount(String(value));  }}>{formatVND(value)}</button>)}</div>

            {/* Display Linked Bank account details for Withdrawal */}
            <div className={styles.method}>
              <Landmark size={22} className="text-blue-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <strong>{mode === "deposit" ? "Phương thức nạp tiền" : "Tài khoản nhận tiền rút"}</strong>
                {mode === "withdraw" && linkedBank ? (
                  <span className="text-emerald-700 font-bold block truncate">
                    {linkedBank.bankName.split(" ")[0]} • {linkedBank.accountNumber} ({linkedBank.accountHolder})
                  </span>
                ) : mode === "withdraw" ? (
                  <span className="text-slate-500 block">
                    Chưa liên kết TK ngân hàng.{" "}
                    <Link href="/account" className="text-rose-600 underline font-bold" onClick={() => dialog.current?.close()}>
                      Liên kết ngay
                    </Link>
                  </span>
                ) : (
                  <span>Chưa kết nối dịch vụ thanh toán</span>
                )}
              </div>
              <CheckCircle2 size={19} className={linkedBank && mode === "withdraw" ? "text-emerald-600" : "text-slate-400"} />
            </div>

            <button className={styles.primary} disabled type="submit">Tiếp tục <ChevronRight size={18} /></button>
          </form>
          <p id="payment-status" className={styles.help}>Chưa thể thực hiện giao dịch lúc này.</p>
        </section>
      </dialog>
    </div>
  </div>;
}

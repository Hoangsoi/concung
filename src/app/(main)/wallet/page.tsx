"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCcw,
  Activity,
  X,
  Wallet,
  ChevronRight,
  CheckCircle2,
  Landmark,
  Check,
  AlertTriangle,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import type { LinkedBank } from "../account/page";
import styles from "./wallet.module.css";
import dashboard from "./dashboard.module.css";

type Kind = "deposit" | "withdraw";

export default function WalletPage() {
  const [mode, setMode] = useState<Kind>("withdraw");
  const [amount, setAmount] = useState("");
  const [linkedBank, setLinkedBank] = useState<LinkedBank | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<{
    amount: number;
    bank: string;
    acc: string;
    remainingBalance: number;
  } | null>(null);

  // Wallet balances and stats
  const [balance, setBalance] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [pendingDeposit, setPendingDeposit] = useState(0);
  const [txCount, setTxCount] = useState(0);

  const dialog = useRef<HTMLDialogElement>(null);

  // Load wallet data from Neon DB API
  const loadWalletData = async () => {
    try {
      const res = await fetch("/api/wallet", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance ?? 0);
        setTotalDeposit(data.totalDeposit ?? 0);
        setTotalWithdraw(data.totalWithdraw ?? 0);
        setPendingDeposit(data.pendingDeposit ?? 0);
        setTxCount(data.txCount ?? 0);
        return;
      }
    } catch (err) {
      console.warn("Failed to fetch wallet data from API:", err);
    }
  };

  const loadLinkedBank = async () => {
    try {
      const res = await fetch("/api/account/bank", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.bank) {
          setLinkedBank(data.bank);
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch bank from API in Wallet:", err);
    }

    setLinkedBank(null);
  };

  useEffect(() => {
    void loadWalletData();
    void loadLinkedBank();

    window.addEventListener("bank-account-changed", loadLinkedBank);
    window.addEventListener("storage", loadWalletData);
    return () => {
      window.removeEventListener("bank-account-changed", loadLinkedBank);
      window.removeEventListener("storage", loadWalletData);
    };
  }, []);

  function choose(kind: Kind) {
    setMode(kind);
    setAmount("");
    setWithdrawSuccess(null);
    dialog.current?.showModal();
  }

  // Amount validation & balance check
  const numAmount = Number(amount);
  const isValidAmount = numAmount > 0;
  const isWithdraw = mode === "withdraw";
  const isBalanceInsufficient = isWithdraw && numAmount > balance;
  const canSubmit = isValidAmount && !isBalanceInsufficient && (!isWithdraw || Boolean(linkedBank));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "withdraw",
          amount: numAmount,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBalance(data.remainingBalance);
        if (linkedBank) {
          setWithdrawSuccess({
            amount: numAmount,
            bank: linkedBank.bankName,
            acc: linkedBank.accountNumber,
            remainingBalance: data.remainingBalance,
          });
        }
        void loadWalletData();
      } else {
        alert(data.error || "Rút tiền thất bại");
      }
    } catch {
      alert("Lỗi kết nối khi rút tiền");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={dashboard.page}>
      <div className={dashboard.container}>
        <h1>Ví của tôi</h1>

        {/* Balance Card */}
        <section className={dashboard.balanceCard} aria-label="Số dư ví">
          <p>Số dư ví</p>
          <strong aria-label="Số dư hiện tại">
            {formatVND(balance)}
          </strong>
          <div className={dashboard.actions}>
            <button type="button" disabled>
              <ArrowDownToLine size={20} />Nạp tiền
            </button>
            <button onClick={() => choose("withdraw")}>
              <ArrowUpFromLine size={20} />Rút tiền
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section aria-labelledby="wallet-stats-title">
          <h2 id="wallet-stats-title">Thống kê ví</h2>
          <div className={dashboard.stats}>
            <div className={dashboard.stat}>
              <span className={`${dashboard.icon} ${dashboard.green}`}>
                <ArrowDownToLine size={20} strokeWidth={1.7} />
              </span>
              <p>TỔNG NẠP</p>
              <strong>{formatVND(totalDeposit)}</strong>
            </div>

            <div className={dashboard.stat}>
              <span className={`${dashboard.icon} ${dashboard.red}`}>
                <ArrowUpFromLine size={20} strokeWidth={1.7} />
              </span>
              <p>TỔNG RÚT</p>
              <strong>{formatVND(totalWithdraw)}</strong>
            </div>

            <div className={dashboard.stat}>
              <span className={`${dashboard.icon} ${dashboard.brown}`}>
                <RefreshCcw size={20} strokeWidth={1.7} />
              </span>
              <p>CHỜ NẠP</p>
              <strong>{formatVND(pendingDeposit)}</strong>
            </div>

            <div className={dashboard.stat}>
              <span className={`${dashboard.icon} ${dashboard.pink}`}>
                <Activity size={20} strokeWidth={1.7} />
              </span>
              <p>GIAO DỊCH</p>
              <strong>{txCount}</strong>
            </div>
          </div>

          <p className={dashboard.notice}>Số dư ví và thống kê được tự động cập nhật sau mỗi giao dịch.</p>
        </section>

        {/* Modal Dialog */}
        <dialog
          ref={dialog}
          className={dashboard.dialog}
          onClick={(e) => {
            if (e.target === e.currentTarget) dialog.current?.close();
          }}
          aria-label={mode === "deposit" ? "Nạp tiền" : "Rút tiền"}
        >
          <section className={styles.panel}>
            <button
              autoFocus
              className={dashboard.close}
              onClick={() => dialog.current?.close()}
              aria-label="Đóng"
            >
              <X size={22} />
            </button>

            <h3>{mode === "deposit" ? "Thêm vào ví, thêm tiện lợi" : "Rút tiền từ ví"}</h3>

            {withdrawSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check size={28} className="stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-base">Tạo yêu cầu rút tiền thành công!</h4>
                  <p className="text-xs text-slate-600">
                    Số tiền <strong className="text-rose-600">{formatVND(withdrawSuccess.amount)}</strong> sẽ được chuyển về ngân hàng{" "}
                    <strong>{withdrawSuccess.bank}</strong> (STK: {withdrawSuccess.acc}) trong 24h.
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Số dư còn lại: <strong>{formatVND(withdrawSuccess.remainingBalance)}</strong>
                  </p>
                </div>
                <button
                  onClick={() => dialog.current?.close()}
                  className="w-full h-11 bg-[#F52862] text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors mt-2"
                >
                  Hoàn tất
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="wallet-amount">Số tiền {mode === "deposit" ? "nạp" : "rút"}</label>

                <div className={styles.amountInput}>
                  <input
                    id="wallet-amount"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Nhập số tiền"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value.replace(/[^0-9]/g, ""));
                    }}
                    aria-describedby="amount-hint payment-status"
                  />
                  <span>đ</span>
                </div>

                {/* Balance Insufficient Warning */}
                {isBalanceInsufficient && (
                  <div className="mt-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>
                      Số dư ví không đủ để rút tiền. (Số dư hiện tại: <strong>{formatVND(balance)}</strong>)
                    </span>
                  </div>
                )}

                <small id="amount-hint" className="mt-2 block">
                  Số dư khả dụng: <strong className="text-slate-900 font-bold">{formatVND(balance)}</strong>
                </small>

                <div className={styles.presets}>
                  {[50000, 100000, 200000, 500000].map((value) => (
                    <button
                      type="button"
                      key={value}
                      aria-pressed={Number(amount) === value}
                      onClick={() => {
                        setAmount(String(value));
                      }}
                    >
                      {formatVND(value)}
                    </button>
                  ))}
                </div>

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
                        <Link
                          href="/account"
                          className="text-rose-600 underline font-bold"
                          onClick={() => dialog.current?.close()}
                        >
                          Liên kết ngay
                        </Link>
                      </span>
                    ) : (
                      <span>Chưa kết nối dịch vụ thanh toán</span>
                    )}
                  </div>
                  <CheckCircle2
                    size={19}
                    className={linkedBank && mode === "withdraw" ? "text-emerald-600" : "text-slate-400"}
                  />
                </div>

                <button
                  className={styles.primary}
                  disabled={!canSubmit || isSubmitting}
                  type="submit"
                >
                  <span>{isSubmitting ? "Đang xử lý..." : "Tiếp tục"}</span>
                  <ChevronRight size={18} />
                </button>
              </form>
            )}
          </section>
        </dialog>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Wallet, History, Heart, ChevronRight, CheckCircle2 } from "lucide-react";
import { formatVND } from "@/lib/utils";
import styles from "./wallet.module.css";

type Kind = "deposit" | "withdraw";
type Transaction = { id: string; kind: Kind; amount: number; date: string };
type Ledger = { balance: number; transactions: Transaction[] };
const key = "concung-wallet-demo-v1";
const empty: Ledger = { balance: 0, transactions: [] };

function readLedger(): Ledger {
  const raw = localStorage.getItem(key);
  if (!raw) return empty;
  const data = JSON.parse(raw);
  if (!Number.isSafeInteger(data.balance) || data.balance < 0 || !Array.isArray(data.transactions) ||
    !data.transactions.every((t: Transaction) => typeof t.id === "string" && ["deposit", "withdraw"].includes(t.kind) && Number.isSafeInteger(t.amount) && t.amount > 0 && !Number.isNaN(Date.parse(t.date)))) {
    throw new Error("Invalid demo wallet");
  }
  return data;
}

export default function WalletPage() {
  const [ledger, setLedger] = useState<Ledger>(empty);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mode, setMode] = useState<Kind>("deposit");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [review, setReview] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const sync = () => {
      try { setLedger(readLedger()); setReady(true); }
      catch { setReady(false); setError("Không đọc được ví trải nghiệm. Ba mẹ vui lòng kiểm tra quyền lưu trữ của trình duyệt."); }
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function choose(kind: Kind) {
    setMode(kind); setReview(false); setError(""); setMessage(""); setAmount("");
  }

  function validate(balance: number) {
    const value = Number(amount);
    if (!/^\d+$/.test(amount) || !Number.isSafeInteger(value) || value < 10000 || value > 10000000) return "Ba mẹ nhập từ 10.000đ đến 10.000.000đ.";
    if (mode === "withdraw" && value > balance) return "Số dư chưa đủ. Ba mẹ vui lòng nhập số tiền nhỏ hơn hoặc nạp thêm.";
    return "";
  }

  function confirm() {
    if (busy.current) return;
    busy.current = true;
    try {
      const current = readLedger();
      const invalid = validate(current.balance);
      if (invalid) { setError(invalid); setReview(false); return; }
      const value = Number(amount);
      const balance = current.balance + (mode === "deposit" ? value : -value);
      if (!Number.isSafeInteger(balance)) throw new Error("Balance limit");
      const next = { balance, transactions: [{ id: crypto.randomUUID(), kind: mode, amount: value, date: new Date().toISOString() }, ...current.transactions] };
      localStorage.setItem(key, JSON.stringify(next));
      setLedger(next); setReview(false); setAmount(""); setError("");
      setMessage(`${mode === "deposit" ? "Đã nạp" : "Đã rút"} ${formatVND(value)} tiền mô phỏng. Số dư đã được cập nhật.`);
    } catch { setError("Chưa lưu được giao dịch. Ba mẹ vui lòng thử lại."); }
    finally { busy.current = false; }
  }

  const transactions = ledger.transactions.filter(t => filter === "all" || t.kind === filter);

  return <div className={styles.page}>
    <header className={styles.header}><div><Link href="/" aria-label="Về trang chủ"><ArrowLeft size={22} /></Link><h1>Ví của ba mẹ</h1><img src="/images/header/logo-concung.png" alt="Con Cưng" width={96} height={35} /></div></header>
    <div className={styles.container}>
      <div className={styles.intro}><span>MỘT CHÚT TIỆN LỢI, THÊM NHIỀU YÊU THƯƠNG</span><h2>Ví Con Cưng <Heart size={24} fill="currentColor" /></h2><p>Quản lý số dư, nạp rút dễ dàng ngay tại đây.</p></div>
      <div className={styles.demo}><Wallet size={20} /><p><strong>Ví trải nghiệm</strong> · Tiền mô phỏng, không chuyển tiền thật. Dữ liệu lưu riêng trên trình duyệt này.</p></div>
      <div className={styles.grid}>
        <section className={styles.balanceCard} aria-label="Số dư ví">
          <div className={styles.cardTop}><span><Wallet size={20} /> Số dư khả dụng</span><button onClick={() => setHidden(!hidden)} aria-label={hidden ? "Hiện số dư" : "Ẩn số dư"}>{hidden ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>
          <p className={styles.balance}>{!ready ? "Đang tải…" : hidden ? "••••••" : formatVND(ledger.balance)}</p>
          <span className={styles.cardNote}>Tiền mô phỏng · VND</span>
          <div className={styles.actions}><button onClick={() => { choose("deposit"); panel.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><ArrowDownLeft /> Nạp tiền</button><button onClick={() => { choose("withdraw"); panel.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><ArrowUpRight /> Rút tiền</button></div>
          <div className={styles.cardFooter}><Heart size={16} /> Cùng ba mẹ chăm chút từng ngày</div>
        </section>

        <section ref={panel} className={styles.panel} aria-label="Nạp và rút tiền">
          <div className={styles.tabs}>{(["deposit", "withdraw"] as Kind[]).map(kind => <button key={kind} aria-pressed={mode === kind} onClick={() => choose(kind)}>{kind === "deposit" ? "Nạp tiền" : "Rút tiền"}</button>)}</div>
          <h3>{review ? "Kiểm tra giao dịch" : mode === "deposit" ? "Thêm vào ví, thêm tiện lợi" : "Rút tiền từ ví"}</h3>
          {review ? <div className={styles.review}>
            <p><span>Giao dịch mô phỏng</span><strong>{mode === "deposit" ? "Nạp tiền" : "Rút tiền"}</strong></p>
            <p><span>Số tiền</span><strong>{formatVND(Number(amount))}</strong></p>
            <p><span>Phí giao dịch</span><strong>Miễn phí</strong></p>
            <p><span>Số dư sau giao dịch</span><strong>{formatVND(ledger.balance + (mode === "deposit" ? Number(amount) : -Number(amount)))}</strong></p>
            <small>Đây là giao dịch thử, không thu tiền hoặc chuyển tiền đến ngân hàng.</small>
            <button className={styles.primary} onClick={confirm}>Xác nhận {mode === "deposit" ? "nạp" : "rút"} mô phỏng <CheckCircle2 size={18} /></button>
            <button className={styles.back} onClick={() => setReview(false)}>Chỉnh sửa số tiền</button>
          </div> : <form onSubmit={e => { e.preventDefault(); const invalid = validate(ledger.balance); setError(invalid); setMessage(""); if (!invalid && ready) setReview(true); }}>
            <label htmlFor="wallet-amount">Số tiền {mode === "deposit" ? "nạp" : "rút"}</label>
            <div className={styles.amountInput}><input id="wallet-amount" inputMode="numeric" autoComplete="off" placeholder="Nhập số tiền" value={amount} onChange={e => { setAmount(e.target.value.replace(/[^0-9]/g, "")); setError(""); setMessage(""); }} aria-describedby="amount-hint wallet-error" /><span>đ</span></div>
            <small id="amount-hint">Từ 10.000đ đến 10.000.000đ / giao dịch</small>
            <div className={styles.presets}>{[50000, 100000, 200000, 500000].map(value => <button type="button" key={value} aria-pressed={Number(amount) === value} onClick={() => { setAmount(String(value)); setError(""); }}>{formatVND(value)}</button>)}</div>
            <div className={styles.method}><Wallet size={22} /><div><strong>{mode === "deposit" ? "Nguồn tiền thử nghiệm" : "Tài khoản nhận thử nghiệm"}</strong><span>Không cần liên kết ngân hàng</span></div><CheckCircle2 size={19} /></div>
            <button className={styles.primary} disabled={!ready || !amount} type="submit">Tiếp tục <ChevronRight size={18} /></button>
          </form>}
          <p id="wallet-error" role="alert" className={styles.error}>{error}</p>
          {message && <p role="status" className={styles.success}><CheckCircle2 size={20} />{message}</p>}
        </section>
      </div>

      <section className={`${styles.panel} ${styles.history}`}><div className={styles.historyTitle}><h3>Lịch sử giao dịch</h3><History size={21} /></div>
        <div className={styles.filters}>{(["all", "deposit", "withdraw"] as const).map(kind => <button key={kind} aria-pressed={filter === kind} onClick={() => setFilter(kind)}>{kind === "all" ? "Tất cả" : kind === "deposit" ? "Nạp tiền" : "Rút tiền"}</button>)}</div>
        {!transactions.length ? <div className={styles.empty}><span><History size={30} /></span><strong>Chưa có giao dịch{filter !== "all" ? filter === "deposit" ? " nạp tiền" : " rút tiền" : ""}</strong><p>Các khoản nạp, rút sẽ hiển thị ở đây để ba mẹ dễ theo dõi.</p></div> : <ul className={styles.transactions}>{transactions.map(t => <li key={t.id}><span className={t.kind === "deposit" ? styles.inIcon : styles.outIcon}>{t.kind === "deposit" ? <ArrowDownLeft size={21} /> : <ArrowUpRight size={21} />}</span><div><strong>{t.kind === "deposit" ? "Nạp tiền vào ví" : "Rút tiền từ ví"}</strong><small>{new Date(t.date).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })}</small><small>Mô phỏng · Thành công</small></div><b className={t.kind === "deposit" ? styles.inAmount : ""}>{t.kind === "deposit" ? "+" : "−"}{formatVND(t.amount)}</b></li>)}</ul>}
      </section>
      <p className={styles.help}>Cần hỗ trợ? <a href="tel:18006609">Gọi 1800 6609</a> <span>· Ba mẹ luôn được lắng nghe</span></p>
    </div>
  </div>;
}

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Wallet, History, Heart, ChevronRight, CheckCircle2 } from "lucide-react";
import { formatVND } from "@/lib/utils";
import styles from "./wallet.module.css";

type Kind = "deposit" | "withdraw";
export default function WalletPage() {
  const [hidden, setHidden] = useState(false);
  const [mode, setMode] = useState<Kind>("deposit");
  const [amount, setAmount] = useState("");
  const panel = useRef<HTMLElement>(null);
  function choose(kind: Kind) { setMode(kind); setAmount(""); }
  return <div className={styles.page}>
    <header className={styles.header}><div><Link href="/" aria-label="Về trang chủ"><ArrowLeft size={22} /></Link><h1>Ví của ba mẹ</h1><img src="/images/header/logo-concung.png" alt="Con Cưng" width={96} height={35} /></div></header>
    <div className={styles.container}>
      <div className={styles.intro}><span>MỘT CHÚT TIỆN LỢI, THÊM NHIỀU YÊU THƯƠNG</span><h2>Ví Con Cưng <Heart size={24} fill="currentColor" /></h2><p>Quản lý số dư, nạp rút dễ dàng ngay tại đây.</p></div>
      <div className={styles.demo}><Wallet size={20} /><p><strong>Nạp/rút chưa khả dụng</strong> · Dịch vụ thanh toán đang chờ kết nối. Ba mẹ vui lòng quay lại sau.</p></div>
      <div className={styles.grid}>
        <section className={styles.balanceCard} aria-label="Số dư ví">
          <div className={styles.cardTop}><span><Wallet size={20} /> Số dư khả dụng</span><button onClick={() => setHidden(!hidden)} aria-label={hidden ? "Hiện số dư" : "Ẩn số dư"}>{hidden ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>
          <p className={styles.balance}>{hidden ? "••••••" : "—"}</p>
          <span className={styles.cardNote}>Chưa thể tải số dư · VND</span>
          <div className={styles.actions}><button onClick={() => { choose("deposit"); panel.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><ArrowDownLeft /> Nạp tiền</button><button onClick={() => { choose("withdraw"); panel.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><ArrowUpRight /> Rút tiền</button></div>
          <div className={styles.cardFooter}><Heart size={16} /> Cùng ba mẹ chăm chút từng ngày</div>
        </section>

        <section ref={panel} className={styles.panel} aria-label="Nạp và rút tiền">
          <div className={styles.tabs}>{(["deposit", "withdraw"] as Kind[]).map(kind => <button key={kind} aria-pressed={mode === kind} onClick={() => choose(kind)}>{kind === "deposit" ? "Nạp tiền" : "Rút tiền"}</button>)}</div>
          <h3>{mode === "deposit" ? "Thêm vào ví, thêm tiện lợi" : "Rút tiền từ ví"}</h3>
          <form onSubmit={e => e.preventDefault()}>
            <label htmlFor="wallet-amount">Số tiền {mode === "deposit" ? "nạp" : "rút"}</label>
            <div className={styles.amountInput}><input id="wallet-amount" inputMode="numeric" autoComplete="off" placeholder="Nhập số tiền" value={amount} onChange={e => { setAmount(e.target.value.replace(/[^0-9]/g, ""));  }} aria-describedby="amount-hint payment-status" /><span>đ</span></div>
            <small id="amount-hint">Từ 10.000đ đến 10.000.000đ / giao dịch</small>
            <div className={styles.presets}>{[50000, 100000, 200000, 500000].map(value => <button type="button" key={value} aria-pressed={Number(amount) === value} onClick={() => { setAmount(String(value));  }}>{formatVND(value)}</button>)}</div>
            <div className={styles.method}><Wallet size={22} /><div><strong>{mode === "deposit" ? "Phương thức nạp tiền" : "Tài khoản nhận tiền"}</strong><span>Chưa kết nối dịch vụ thanh toán</span></div><CheckCircle2 size={19} /></div>
            <button className={styles.primary} disabled type="submit">Tiếp tục <ChevronRight size={18} /></button>
          </form>
          <p id="payment-status" className={styles.help}>Chưa thể thực hiện giao dịch lúc này.</p>
        </section>
      </div>

      <Link href="/history" className={styles.historyLink}><History size={20} /><span>Xem lịch sử nạp/rút</span><ChevronRight size={18} /></Link>
    </div>
  </div>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Phone, CalendarDays, Landmark, ChevronRight, Shield, LogOut, X, CheckCircle2, Edit3, Trash2 } from "lucide-react";
import styles from "./account.module.css";

type Profile = { fullName: string; phone: string; createdAt: string | null };

export type LinkedBank = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  linkedAt?: string;
};

const POPULAR_BANKS = [
  "Vietcombank (VCB)",
  "Techcombank (TCB)",
  "MB Bank (MB)",
  "VietinBank (CTG)",
  "BIDV",
  "VPBank",
  "ACB",
  "Agribank",
  "Sacombank",
  "TPBank",
  "VIB",
  "MSB",
  "MoMo (Ví điện tử)",
];

export default function AccountPage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // Bank account linkage states
  const [linkedBank, setLinkedBank] = useState<LinkedBank | null>(null);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [selectedBank, setSelectedBank] = useState(POPULAR_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [bankFormError, setBankFormError] = useState("");

  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/account", { cache: "no-store" });
      if (response.status === 401) { setGuest(true); setUser(null); return; }
      if (!response.ok) throw new Error();
      const data = await response.json(); setUser(data.user); setGuest(false);
    } catch { setError("Không tải được thông tin từ hệ thống. Ba mẹ vui lòng thử lại."); }
    finally { setLoading(false); }
  }

  // Load saved bank account from localStorage
  const loadSavedBank = () => {
    try {
      const saved = localStorage.getItem("concung_bank_account");
      if (saved) {
        const parsed = JSON.parse(saved);
        setLinkedBank(parsed);
        setSelectedBank(parsed.bankName || POPULAR_BANKS[0]);
        setAccountNumber(parsed.accountNumber || "");
        setAccountHolder(parsed.accountHolder || "");
      } else {
        setLinkedBank(null);
      }
    } catch {
      setLinkedBank(null);
    }
  };

  useEffect(() => {
    void load();
    loadSavedBank();

    window.addEventListener("bank-account-changed", loadSavedBank);
    return () => {
      window.removeEventListener("bank-account-changed", loadSavedBank);
    };
  }, []);

  async function logout() {
    setLoggingOut(true); setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      localStorage.removeItem("user"); window.dispatchEvent(new Event("user-auth-change"));
      setUser(null); router.replace("/auth"); router.refresh();
    } catch { setError("Chưa đăng xuất được. Vui lòng thử lại."); setLoggingOut(false); }
  }

  // Save bank account permanently
  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    setBankFormError("");
    setSaveSuccess(false);

    if (!accountNumber.trim()) {
      setBankFormError("Vui lòng nhập số tài khoản ngân hàng.");
      return;
    }
    if (!accountHolder.trim()) {
      setBankFormError("Vui lòng nhập tên chủ tài khoản.");
      return;
    }

    const bankData: LinkedBank = {
      bankName: selectedBank,
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim().toUpperCase(),
      linkedAt: new Date().toLocaleDateString("vi-VN"),
    };

    try {
      localStorage.setItem("concung_bank_account", JSON.stringify(bankData));
      window.dispatchEvent(new Event("bank-account-changed"));
      setLinkedBank(bankData);
      setIsEditingBank(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      setBankFormError("Không thể lưu tài khoản ngân hàng. Vui lòng thử lại.");
    }
  };

  // Unlink bank account
  const handleUnlinkBank = () => {
    if (confirm("Ba mẹ có chắc chắn muốn hủy liên kết tài khoản ngân hàng này?")) {
      localStorage.removeItem("concung_bank_account");
      window.dispatchEvent(new Event("bank-account-changed"));
      setLinkedBank(null);
      setAccountNumber("");
      setAccountHolder("");
      setIsEditingBank(true);
    }
  };

  return <div className={styles.page}><div className={styles.container}>
    <h1>Tài khoản</h1>
    {loading ? <p role="status" className={styles.message}>Đang tải thông tin tài khoản…</p> : guest ? <div className={styles.guest}><Shield size={42} /><h2>Chào mừng ba mẹ!</h2><p>Đăng nhập để xem thông tin tài khoản của mình.</p><Link href="/login">Đăng nhập</Link><Link href="/register">Đăng ký tài khoản</Link></div> : user && <>
      <section className={styles.profile} aria-label="Hồ sơ tài khoản"><div className={styles.avatar}>{user.fullName.trim().slice(0,1).toLocaleUpperCase("vi-VN")}</div><h2>{user.fullName}</h2><span>Trạng thái chưa cập nhật</span></section>
      <h3>Thông tin cá nhân</h3>
      <div className={styles.list}>
        <div className={styles.row}><span className={styles.pinkIcon}><Star size={20} /></span><div><label>ĐIỂM TÍN NHIỆM</label><strong className={styles.pink}>Chưa cập nhật</strong></div><span className={styles.track} aria-hidden="true" /></div>
        <div className={styles.row}><span className={styles.icon}><Phone size={20} /></span><div><label>ĐIỆN THOẠI</label><strong>{user.phone}</strong></div></div>
        <div className={styles.row}><span className={styles.icon}><CalendarDays size={20} /></span><div><label>NGÀY THAM GIA</label><strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN", { day:"2-digit", month:"2-digit", year:"numeric", timeZone:"Asia/Ho_Chi_Minh" }) : "Chưa cập nhật"}</strong></div></div>
      </div>

      {/* Bank Account linkage row */}
      <button className={`${styles.row} ${styles.bank}`} onClick={() => dialog.current?.showModal()}>
        <span className={styles.blueIcon}><Landmark size={20} /></span>
        <div>
          <strong>Tài khoản ngân hàng</strong>
          <small>
            {linkedBank
              ? `${linkedBank.bankName.split(" ")[0]} • ****${linkedBank.accountNumber.slice(-4)} (${linkedBank.accountHolder})`
              : "Quản lý liên kết ngân hàng"}
          </small>
        </div>
        <ChevronRight size={18} />
      </button>

      <h3>Hạng thành viên</h3><section className={styles.tier}><div className={styles.level}>—</div><div><label>HẠNG HIỆN TẠI</label><strong>Chưa cập nhật</strong><small>Thông tin hạng thành viên chưa được thiết lập</small></div><Shield className={styles.shield} size={88} /></section>
      <button className={styles.logout} onClick={logout} disabled={loggingOut}><LogOut size={20} />{loggingOut ? "Đang đăng xuất…" : "Đăng xuất"}</button>
    </>}
    {error && <div role="alert" className={styles.message}><p>{error}</p><button onClick={load}>Thử lại</button></div>}

    {/* Bank Account Modal Dialog */}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="bank-title">
      <div className={styles.dialogHeader}>
        <div className={styles.dialogHeaderTitle}>
          <Landmark size={24} />
          <span id="bank-title">Tài khoản ngân hàng</span>
        </div>
        <button className={styles.close} onClick={() => dialog.current?.close()} aria-label="Đóng">
          <X size={18} />
        </button>
      </div>

      {saveSuccess && (
        <div className={styles.successAlert}>
          ✓ Đã lưu thông tin tài khoản ngân hàng thành công! Thông tin sẽ được tự động sử dụng cho các lần rút tiền sau.
        </div>
      )}

      {/* Case 1: Bank already linked and not editing */}
      {linkedBank && !isEditingBank ? (
        <div className="space-y-4">
          <div className={styles.bankCard}>
            <div className={styles.bankCardTop}>
              <span className={styles.bankCardName}>{linkedBank.bankName}</span>
              <span className={styles.bankCardBadge}>✓ Đã liên kết</span>
            </div>
            <div className={styles.bankCardNumber}>
              {linkedBank.accountNumber.replace(/(\d{4})/g, "$1 ").trim()}
            </div>
            <div className={styles.bankCardHolder}>
              CHỦ TK: {linkedBank.accountHolder}
            </div>
          </div>

          <p className={styles.noteText}>
            Tài khoản này được dùng để rút tiền từ Ví Con Cưng. Thông tin được lưu bảo mật và cố định cho các lần rút sau.
          </p>
        </div>
      ) : (
        /* Case 2: Form to Link or Update Bank Account */
        <form onSubmit={handleSaveBank} className={styles.bankForm}>
          {bankFormError && (
            <div className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-lg border border-red-200">
              ⚠️ {bankFormError}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="select-bank">Chọn Ngân hàng *</label>
            <select
              id="select-bank"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              {POPULAR_BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="input-acc-num">Số tài khoản ngân hàng *</label>
            <input
              id="input-acc-num"
              type="text"
              inputMode="numeric"
              placeholder="Ví dụ: 1903668899"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="input-acc-holder">Họ và tên chủ tài khoản *</label>
            <input
              id="input-acc-holder"
              type="text"
              placeholder="Ví dụ: NGUYEN THI MAI"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
            />
          </div>

          <p className={styles.noteText}>
            Lưu ý: Tên chủ tài khoản phải viết hoa không dấu và khớp với tên trên thẻ ngân hàng của bạn. Thông tin được lưu cố định cho các lần rút tiền sau.
          </p>

          <button type="submit" className={styles.saveBtn}>
            <CheckCircle2 size={18} className="inline mr-1.5" />
            Lưu tài khoản ngân hàng
          </button>

          {linkedBank && (
            <button
              type="button"
              className={styles.unlinkBtn}
              onClick={() => setIsEditingBank(false)}
            >
              Quay lại
            </button>
          )}
        </form>
      )}
    </dialog>
  </div></div>;
}

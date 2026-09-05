"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./VoucherStrip.module.css";
export interface Voucher {
  id: string;
  badge: string;
  title: string;
  condition: string;
  expiry: string;
  type: "pink" | "green";
  iconType: "logo" | "truck";
  scope: string;
}

const MOCK_VOUCHERS: Voucher[] = [
  { id: "v-12", badge: "Chỉ Online", title: "Giảm 12%", condition: "tối đa 100.000đ đơn từ 500.000đ", expiry: "Thời hạn: 05-06/09", type: "pink", iconType: "logo", scope: "Trừ sữa dưới 2 tuổi" },
  {
    id: "v-1",
    badge: "Chỉ Online",
    title: "Giảm 8%",
    condition: "tối đa 60.000đ đơn từ 400.000đ",
    expiry: "Thời hạn: 01-30/09",
    type: "pink",
    iconType: "logo",
    scope: "Trừ sữa dưới 24 tháng tuổi và mộ...",
  },
  {
    id: "v-2",
    badge: "Chỉ Online",
    title: "Giảm 300K",
    condition: "đơn từ 0đ",
    expiry: "Thời hạn: 01-30/09",
    type: "green",
    iconType: "truck",
    scope: "Ghế ngồi ô tô",
  },
  {
    id: "v-3",
    badge: "Chỉ Online",
    title: "Giảm 100K",
    condition: "đơn từ 200.000đ",
    expiry: "Thời hạn: 01-30/09",
    type: "green",
    iconType: "truck",
    scope: "Sữa nước",
  },
  {
    id: "v-4",
    badge: "Chỉ Online",
    title: "Giảm 30K",
    condition: "đơn từ 300.000đ",
    expiry: "Thời hạn: 01-30/09",
    type: "green",
    iconType: "truck",
    scope: "Tất cả sản phẩm",
  },
];

export function VoucherStrip() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [edges, setEdges] = useState({ start: true, end: false });
  const trackRef = useRef<HTMLDivElement>(null);
  const updateEdges = () => {
    const track = trackRef.current;
    if (track) setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2 });
  };
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track); updateEdges();
    return () => observer.disconnect();
  }, []);
  const scroll = (direction: number) => trackRef.current?.scrollBy({ left: direction * 374, behavior: "smooth" });
  return <section className={styles.section} aria-labelledby="voucher-heading">
    <h2 id="voucher-heading">Nhận Voucher</h2>
    <div className={styles.track} ref={trackRef} onScroll={updateEdges}>
      {MOCK_VOUCHERS.map(voucher => <article key={voucher.id} className={styles.ticket}>
        <svg className={styles.edge} width="9" height="114" viewBox="0 0 9 114" aria-hidden="true"><path d="M .5 0 V 25 A 7 7 0 0 1 .5 39 V 46 A 7 7 0 0 1 .5 60 V 67 A 7 7 0 0 1 .5 81 V 88 A 7 7 0 0 1 .5 102 V 114" fill="none" stroke="#ddd" /></svg>
        <div className={styles.identity}>
          <span className={styles.badge}>{voucher.badge}</span>
          <div className={styles.icon}>{voucher.iconType === "logo" ? <img src="/logo-concung.png" alt="Con Cưng" /> : <svg viewBox="0 0 40 34" aria-label="Miễn phí vận chuyển" role="img"><path d="M3 5h22v19H3zM25 12h9l5 8v4H25z" fill="#00cf66"/><path d="M1 4h14M0 10h10" stroke="#00cf66" strokeWidth="3" strokeLinecap="round"/><circle cx="10" cy="27" r="4" fill="#53757c" stroke="white" strokeWidth="2"/><circle cx="31" cy="27" r="4" fill="#53757c" stroke="white" strokeWidth="2"/><text x="19" y="19" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontStyle="italic">Free</text></svg>}</div>
          <span className={styles.scope}>{voucher.scope}</span>
        </div>
        <div className={styles.details}>
          <h3 style={{color: voucher.type === "pink" ? "#ff0088" : "#00c853"}}>{voucher.title}</h3>
          <p>{voucher.condition}</p>
          <div className={styles.bottom}><span>{voucher.expiry}</span><button type="button" disabled={savedIds.includes(voucher.id)} onClick={() => setSavedIds(ids => [...ids, voucher.id])}>{savedIds.includes(voucher.id) ? "Đã lưu" : "Lưu"}</button></div>
        </div>
      </article>)}
    </div>
    <button type="button" className={`${styles.arrow} ${styles.previous}`} disabled={edges.start} onClick={() => scroll(-1)} aria-label="Voucher trước"><ChevronLeft size={20} /></button>
    <button type="button" className={`${styles.arrow} ${styles.next}`} disabled={edges.end} onClick={() => scroll(1)} aria-label="Voucher tiếp"><ChevronRight size={20} /></button>
  </section>;
}

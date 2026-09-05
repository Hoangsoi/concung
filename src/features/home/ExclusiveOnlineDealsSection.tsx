"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ExclusiveOnlineDealsSection.module.css";

const groups = [
  { title: "Tã Takato, Huggies,...", color: "#ff379b", href: "https://concung.com/bim-ta-khuyen-mai-101635.html", names: ["Tã Huggies Nature Made L44", "Tã quần Animo XL"] },
  { title: "Sữa Aptamil, NAN,..", color: "#ff6d00", href: "https://concung.com/sua-bot-101586.html", names: ["Sữa Aptamil Profutura KID 3", "Sữa Alphagen Premium 3"] },
  { title: "GrowPLUS+, Pediasure,...", color: "#fa9600", href: "https://concung.com/sua-tuoi-cac-loai-101842.html", names: ["Sữa GrowPLUS+ Đỏ", "Sữa Pediasure"] },
];

export function ExclusiveOnlineDealsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
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
  const scroll = (direction: number) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * 428, behavior: "smooth" });
  };
  return <section className={styles.section} aria-labelledby="exclusive-deals-heading">
    <div className={styles.heading}>
      <h2 id="exclusive-deals-heading">Deal Độc Quyền Online</h2>
      <a href={groups[0].href}>Xem tất cả <ChevronRight size={18} /></a>
    </div>
    <div className={styles.track} ref={trackRef} onScroll={updateEdges}>
      {groups.map((group, index) => <a key={group.href} href={group.href} className={styles.group} style={{ backgroundImage: `url(/images/deals/promotion-bg-${index + 1}.png)`, color: group.color }}>
        <div className={styles.products}>
          {group.names.map((name, productIndex) => <div className={styles.product} key={name}><img src={`/images/deals/reference-${index * 2 + productIndex}.webp`} alt={name} draggable={false} /></div>)}
        </div>
        <div className={styles.caption}><span>{group.title}</span><img src={`/images/deals/next-${index + 1}.png`} alt="" width={24} height={24} /></div>
      </a>)}
    </div>
    <button type="button" className={`${styles.arrow} ${styles.previous}`} disabled={edges.start} onClick={() => scroll(-1)} aria-label="Xem deal trước"><ChevronLeft size={20} /></button>
    <button type="button" className={`${styles.arrow} ${styles.next}`} disabled={edges.end} onClick={() => scroll(1)} aria-label="Xem deal tiếp"><ChevronRight size={20} /></button>
  </section>;
}

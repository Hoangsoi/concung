"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import deals from "@/data/brand-deals.json";
import styles from "./BrandDealsSection.module.css";

export function BrandDealsSection() {
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
    observer.observe(track);
    updateEdges();
    return () => observer.disconnect();
  }, []);
  const scroll = (direction: number) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 4 / 5.6, behavior: "smooth" });
  };
  return <section className={styles.section} aria-labelledby="brand-deals-heading">
    <h2 id="brand-deals-heading">Ưu Đãi Từ Thương Hiệu</h2>
    <div className={styles.track} ref={trackRef} onScroll={updateEdges}>
      {deals.map(deal => <a className={styles.item} key={deal.id} href={deal.href} title={deal.promoText}>
        <div className={`${styles.product} ${deal.id === 0 ? styles.outlined : ""}`}>
          <img src={deal.image} alt={deal.name} width={112} height={112} draggable={false} />
        </div>
        <div className={styles.logo}><img src={deal.logo} alt="" draggable={false} /></div>
        <div className={styles.offer}><span>{deal.promoText}</span></div>
      </a>)}
    </div>
    <button className={`${styles.arrow} ${styles.previous}`} type="button" disabled={edges.start} onClick={() => scroll(-1)} aria-label="Thương hiệu trước"><ChevronLeft size={20} /></button>
    <button className={`${styles.arrow} ${styles.next}`} type="button" disabled={edges.end} onClick={() => scroll(1)} aria-label="Thương hiệu tiếp"><ChevronRight size={20} /></button>
  </section>;
}

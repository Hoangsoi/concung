"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import services from "@/data/services.json";
import styles from "./UtilityServicesSection.module.css";

export function UtilityServicesSection() {
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
    if (track) track.scrollBy({ left: direction * 440, behavior: "smooth" });
  };
  return <section className={styles.section} aria-labelledby="utility-services-heading">
    <h2 id="utility-services-heading">Tiện Ích, Dịch Vụ</h2>
    <div className={styles.track} ref={trackRef} onScroll={updateEdges}>
      {services.map(service => <a className={styles.item} key={service.id} href={service.href}>
        <div className={styles.artwork}><img src={service.icon} alt="" width={70} height={70} draggable={false} />{service.id === 0 && <span className={styles.badge}>1158</span>}</div>
        <span className={styles.label}>{service.title}</span>
      </a>)}
    </div>
    <button type="button" className={`${styles.arrow} ${styles.previous}`} disabled={edges.start} onClick={() => scroll(-1)} aria-label="Tiện ích trước"><ChevronLeft size={20} /></button>
    <button type="button" className={`${styles.arrow} ${styles.next}`} disabled={edges.end} onClick={() => scroll(1)} aria-label="Tiện ích tiếp"><ChevronRight size={20} /></button>
  </section>;
}

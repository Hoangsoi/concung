"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import products from "@/data/quick-deals.json";
import styles from "./MuaNhanhGiamNgaySection.module.css";

export function MuaNhanhGiamNgaySection() {
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
    if (track) track.scrollBy({ left: direction * track.clientWidth * 4 / 4.7, behavior: "smooth" });
  };
  return <section className={styles.section} aria-labelledby="quick-deals-heading">
    <div className={styles.heading}>
      <h2 id="quick-deals-heading">Mua Nhanh Giảm Ngay</h2>
      <a href="https://concung.com/mua-ngay-giam-ngay.html">Xem tất cả <ChevronRight size={16} /></a>
    </div>
    <div className={styles.track} ref={trackRef} onScroll={updateEdges}>
      {products.map(product => <article className={styles.slide} key={product.id}>
        <a href={product.href} className={styles.card} title={product.name}>
          <div className={styles.artwork}>
            {product.id !== 1 && <img className={styles.frame} src="/images/bestsellers/1787568231-frame-sp-26.webp" alt="" />}
            <div className={`${styles.picture} ${product.id !== 1 ? styles.framed : ""}`}><img src={product.image} alt={product.name} draggable={false} /></div>
            {(product.id === 2 || product.id === 4) && <div className={styles.milkSize}>
              <div className={styles.sizeTop}>{product.id === 2 ? "850" : "1400"}<small>{product.id === 2 ? "g" : "gr"}</small></div>
              <div>{product.id === 2 ? "Người" : "2-10"}<small>{product.id === 2 ? "lớn" : "tuổi"}</small></div>
            </div>}
            {(product.id === 3 || product.id === 5) && <div className={styles.diaperSize}>
              <img src={`/images/bestsellers/${product.id === 3 ? "ta-quan" : "ta-dan"}.png`} alt="" />
              <small>{product.id === 3 ? "Tã quần" : "Tã dán"}</small>
              <div className={styles.diaperMiddle}>{product.id === 3 ? "XL" : "NB"}<small>{product.id === 3 ? "12-18Kg" : "<5Kg"}</small></div>
              <div>{product.id === 3 ? "38" : "60"}<small>miếng</small></div>
            </div>}
          </div>
          <h3>{product.name}</h3>
          <div className={styles.stars} role="img" aria-label="5 trên 5 sao" />
          <div className={styles.priceRow}><span className={styles.price}>{new Intl.NumberFormat("vi-VN").format(product.price)}đ</span><span className={styles.discount}>-{product.discount}<small>%</small></span></div>
        </a>
      </article>)}
    </div>
    <button type="button" className={`${styles.arrow} ${styles.previous}`} disabled={edges.start} onClick={() => scroll(-1)} aria-label="Sản phẩm trước"><ChevronLeft size={20} /></button>
    <button type="button" className={`${styles.arrow} ${styles.next}`} disabled={edges.end} onClick={() => scroll(1)} aria-label="Sản phẩm tiếp"><ChevronRight size={20} /></button>
  </section>;
}

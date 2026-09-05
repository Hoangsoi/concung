"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import products from "@/data/gift-deals.json";
import styles from "./SanQuaTaSuaSection.module.css";

export function SanQuaTaSuaSection() {
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
  return <section className={styles.section} aria-labelledby="gift-deals-heading">
    <div className={styles.heading}>
      <h2 id="gift-deals-heading">Săn Quà Tã Sữa</h2>
      <a href="https://concung.com/san-qua-ta-sua.html">Săn ngay <ChevronRight size={16} /></a>
    </div>
    <div className={styles.track} ref={trackRef} onScroll={updateEdges}>
      {products.map(product => <article className={styles.slide} key={product.id}>
        <a href={product.href} className={styles.card} title={product.name}>
          <div className={styles.artwork}>
            <img className={styles.frame} src={`/images/bestsellers/${product.id === 5 ? "1787567573-frame-sp-25.webp" : "1787568231-frame-sp-26.webp"}`} alt="" />
            <div className={`${styles.picture} ${styles.framed}`}><img src={product.image} alt={product.name} draggable={false} /></div>
            <div className={styles.giftColumn}>
              <img className={styles.giftLabel} src="/images/bestsellers/gift.png" alt="Tặng" />
              {product.id === 4 ? <div className={styles.voucher}><small>Phiếu quà tặng</small><strong>150k</strong></div> : <img className={styles.giftImage} src={product.gift} alt="Quà tặng kèm sản phẩm" />}
              {(product.id === 2 || product.id === 4 || product.id === 5) && <div className={styles.dots}><i /><i /></div>}
              {(product.id === 2 || product.id === 4) ? <div className={styles.halfMilk}>
                <div>{product.id === 2 ? "1.5" : "800"}<small>{product.id === 2 ? "Kg" : "gr"}</small></div>
                <span>Từ 2<small>tuổi</small></span>
              </div> : <div className={styles.halfDiaper}>
                <img src="/images/bestsellers/ta-quan.png" alt="" /><small>Tã quần</small><span>{product.id === 1 ? "XXL | 60" : product.id === 3 ? "L | 70" : "M | 50"}</span>
              </div>}
            </div>
          </div>
          <h3>{product.name}</h3>
          <div className={styles.stars} role="img" aria-label="5 trên 5 sao" />
          <div className={styles.priceRow}><span className={styles.price}>{new Intl.NumberFormat("vi-VN").format(product.price)}đ</span>{product.discount > 0 && <span className={styles.discount}>-{product.discount}<small>%</small></span>}</div>
        </a>
      </article>)}
    </div>
    <button type="button" className={`${styles.arrow} ${styles.previous}`} disabled={edges.start} onClick={() => scroll(-1)} aria-label="Sản phẩm trước"><ChevronLeft size={20} /></button>
    <button type="button" className={`${styles.arrow} ${styles.next}`} disabled={edges.end} onClick={() => scroll(1)} aria-label="Sản phẩm tiếp"><ChevronRight size={20} /></button>
  </section>;
}


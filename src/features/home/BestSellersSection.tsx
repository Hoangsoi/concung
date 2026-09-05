"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import tabs from "@/data/bestsellers.json";
import styles from "./BestSellersSection.module.css";

type Product = (typeof tabs)[number]["products"][number];
function Specification({ text }: { text: string }) {
  const [value, unit] = text.trim().split(/\s*\n\s*/);
  return <><span>{value}</span>{unit && <small>{unit}</small>}</>;
}
function ProductArtwork({ product }: { product: Product }) {
  const diaper = product.labelType === "1";
  const specification = product.labelType === "2" || product.labelType === "3";
  return <div className={styles.artwork}>
    {product.frame && <img className={styles.frame} src={product.frame} alt="" />}
    <div className={`${styles.picture} ${product.gift || specification || diaper ? styles.withAside : ""} ${product.frame ? styles.framedPicture : ""}`}>
      <img src={product.image} alt={product.name} draggable={false} />
    </div>
    {product.gift && <div className={`${styles.gift} ${diaper ? styles.diaperGift : ""}`}>
      <img className={styles.giftLabel} src="/images/bestsellers/gift.png" alt="Tặng" />
      <img className={styles.giftPicture} src={product.gift} alt="Quà tặng kèm sản phẩm" />
      {product.id !== "50938" && <div className={styles.dots}><i /><i /></div>}
      {diaper && <div className={styles.diaperSize}><img src="/images/bestsellers/ta-quan.png" alt="" /><span>Tã quần</span><span>{product.middle} | 50</span></div>}
    </div>}
    {diaper && !product.gift && <div className={`${styles.diaperSize} ${styles.standaloneDiaper}`}>
      <img src="/images/bestsellers/ta-dan.png" alt="" /><span>{product.top}</span><span>{product.middle} | 60</span><span>{product.bottom}</span>
    </div>}
    {specification && <div className={`${styles.specification} ${product.labelType === "2" ? styles.blue : ""}`}>
      <div className={styles.specTop}><Specification text={product.top} /></div>
      <div className={styles.specMiddle}><Specification text={product.middle} /></div>
      {product.bottom && <div className={styles.specBottom}><Specification text={product.bottom} /></div>}
    </div>}
    {product.ship && <img className={styles.shipping} src={product.ship} alt="Freeship 40.000đ" />}
  </div>;
}
export function BestSellersSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeTab = tabs[activeIndex];
  const updateArrows = () => {
    const track = scrollRef.current;
    if (!track) return;
    setCanGoBack(track.scrollLeft > 2);
    setCanGoForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
  };
  useEffect(() => {
    const track = scrollRef.current;
    if (!track) return;
    track.scrollLeft = 0;
    updateArrows();
    const observer = new ResizeObserver(updateArrows);
    observer.observe(track);
    return () => observer.disconnect();
  }, [activeIndex]);
  const selectTab = (index: number, focus = false) => {
    setActiveIndex(index);
    if (focus) tabRefs.current[index]?.focus();
  };
  const scroll = (direction: number) => {
    const track = scrollRef.current;
    if (track) track.scrollBy({left: direction * track.clientWidth * 4 / 4.7, behavior: "smooth"});
  };
  return <section className={styles.section} aria-labelledby="bestsellers-heading" style={{ backgroundImage: `url(${activeTab.background})`, "--tab-color": activeTab.color } as React.CSSProperties}>
    <div className={styles.heading}>
      <h2 id="bestsellers-heading">{activeTab.title}</h2>
      <a href={`/category/${activeTab.id}`} className={styles.viewAll}>Xem tất cả <ChevronRight size={13} /></a>
    </div>
    <div className={styles.tabs} role="tablist" aria-label="Nhóm sản phẩm nổi bật">
      {tabs.map((tab, index) => <button key={tab.id} ref={(element) => { tabRefs.current[index] = element; }}
        id={`bestsellers-tab-${tab.id}`} role="tab" type="button" aria-label={tab.title}
        aria-selected={activeIndex === index} aria-controls="bestsellers-panel" tabIndex={activeIndex === index ? 0 : -1}
        onClick={() => selectTab(index)} onKeyDown={(event) => {
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
          else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = tabs.length - 1;
          else return;
          event.preventDefault(); selectTab(next, true);
        }}><img src={activeIndex === index ? tab.activeIcon : tab.icon} alt="" width={72} height={63} draggable={false} /></button>)}
    </div>
    <div id="bestsellers-panel" role="tabpanel" aria-labelledby={`bestsellers-tab-${activeTab.id}`} className={styles.panel}>
      <div className={styles.track} ref={scrollRef} onScroll={updateArrows}>
        {activeTab.products.map((product) => <article key={`${activeTab.id}-${product.id}`} className={styles.slide}>
          <a href={product.href} className={styles.card} title={product.name}>
            <ProductArtwork product={product} />
            <h3>{product.name}</h3>
            <div className={styles.stars} role="img" aria-label="5 trên 5 sao" />
            <div className={styles.priceRow}><span className={styles.price}>{new Intl.NumberFormat("vi-VN").format(product.price)}đ</span>
              {product.discount > 0 && <span className={styles.discount}>-{product.discount}%</span>}
            </div>
          </a>
        </article>)}
      </div>
      <button type="button" className={`${styles.arrow} ${styles.previous}`} disabled={!canGoBack} aria-label="Sản phẩm trước" onClick={() => scroll(-1)}><ChevronLeft size={20} /></button>
      <button type="button" className={`${styles.arrow} ${styles.next}`} disabled={!canGoForward} aria-label="Sản phẩm tiếp" onClick={() => scroll(1)}><ChevronRight size={20} /></button>
    </div>
  </section>;
}

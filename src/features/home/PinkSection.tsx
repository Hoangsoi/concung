"use client";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import articles from "@/data/pink-articles.json";
import styles from "./PinkSection.module.css";
const featured = articles.slice(0, 6);
export function PinkSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % featured.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused, active]);
  return <section className={styles.section} aria-labelledby="pink-heading">
    <div className={styles.heading}><h2 id="pink-heading">PINK</h2><a href="https://concung.com/thong-tin-bo-ich.html">Xem tất cả <ChevronRight size={18} /></a></div>
    <div className={styles.grid}>
      <div className={styles.featured} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
        {featured.map((article, index) => <a key={article.id} href={article.href} className={`${styles.card} ${styles.slide} ${index === active ? styles.active : ""}`} aria-hidden={index !== active} tabIndex={index === active ? 0 : -1}>
          <img src={article.image} alt={article.title} width={630} height={400} draggable={false} />
          <div className={styles.caption}><h3>{article.title}</h3></div>
        </a>)}
        <div className={styles.dots} aria-label="Chọn bài viết PINK">{featured.map((article, index) => <button type="button" key={article.id} aria-label={article.title} aria-current={index === active ? "true" : undefined} className={index === active ? styles.selected : ""} onClick={() => setActive(index)} />)}</div>
      </div>
      <div className={styles.right}>{articles.slice(6, 8).map(article => <a key={article.id} className={styles.card} href={article.href}>
        <img src={article.image} alt={article.title} width={335} height={192} draggable={false} />
        <div className={styles.caption}><h3>{article.title}</h3></div>
      </a>)}</div>
    </div>
  </section>;
}
